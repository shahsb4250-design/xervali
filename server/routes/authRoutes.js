const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const https = require('https');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');
const { protect, admin, JWT_SECRET } = require('../middleware/authMiddleware');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Real Google ID Token Verification
async function verifyGoogleIdToken(token) {
  // 1. If GOOGLE_CLIENT_ID is configured, verify using google-auth-library
  if (process.env.GOOGLE_CLIENT_ID) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      return ticket.getPayload();
    } catch (err) {
      console.warn('OAuth2Client direct verification warning, trying tokeninfo:', err.message);
    }
  }

  // 2. Google OAuth2 tokeninfo validation (cryptographically validates Google's signature, issuer, and expiry)
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error || json.error_description) {
            return reject(new Error(json.error_description || json.error));
          }
          if (json.iss !== 'accounts.google.com' && json.iss !== 'https://accounts.google.com') {
            return reject(new Error('Invalid token issuer'));
          }
          if (process.env.GOOGLE_CLIENT_ID && json.aud !== process.env.GOOGLE_CLIENT_ID) {
            return reject(new Error('Google Client ID mismatch'));
          }
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
}

// In-Memory Brute-Force Rate Limiter with TTL Cleanup to prevent memory leak
const loginAttempts = new Map(); // ip_email -> { count, lastAttempt, lockUntil }

// Periodic cleanup every 10 minutes to prevent memory leak
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.lastAttempt > 15 * 60 * 1000 && (!record.lockUntil || now > record.lockUntil)) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);
cleanupInterval.unref(); // Avoid holding process open

function checkRateLimit(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  if (record.lockUntil && now < record.lockUntil) {
    const minutesLeft = Math.ceil((record.lockUntil - now) / 60000);
    return {
      allowed: false,
      message: `Security lockdown: too many failed attempts. Please retry in ${minutesLeft} minute(s).`
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lastAttempt: now, lockUntil: null };
  record.count += 1;
  record.lastAttempt = now;

  // Lock for 15 minutes after 5 failed attempts
  if (record.count >= 5) {
    record.lockUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(key, record);
}

function clearAttempts(key) {
  loginAttempts.delete(key);
}

// Basic email sanitization and validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

// @desc    Auth user & get token (Standard Email / Password)
// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email format' });
    }

    const rateKey = `${req.ip}_${cleanEmail}`;
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.message });
    }

    const user = await db.findUserByEmail(cleanEmail);
    if (!user) {
      recordFailedAttempt(rateKey);
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      recordFailedAttempt(rateKey);
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    // Clear rate limit record on successful authentication
    clearAttempts(rateKey);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      avatar: user.avatar || '',
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Sign In or Register with Real Google Account (Cryptographically Verified with Google)
// @route   POST /api/auth/google
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential (ID token) is required for real Google authentication' });
    }

    const payload = await verifyGoogleIdToken(credential);
    if (!payload || !payload.email) {
      return res.status(401).json({ message: 'Failed to verify Google identity' });
    }

    const cleanEmail = String(payload.email).trim().toLowerCase();
    const cleanName = String(payload.name || cleanEmail.split('@')[0]).trim();
    const googleId = payload.sub || ('g_' + Date.now());
    const avatar = payload.picture || '';

    const user = await db.findOrCreateGoogleUser({
      email: cleanEmail,
      name: cleanName,
      googleId,
      avatar
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      avatar: user.avatar || '',
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error('Google verification failed:', err.message);
    res.status(401).json({ message: 'Google authentication failed: ' + err.message });
  }
});

// @desc    Register a new customer with secure password hashing
// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters for security' });
    }

    const newUser = await db.createUser({
      name: String(name).trim(),
      email: cleanEmail,
      password,
      role: 'customer'
    });

    res.status(201).json({
      ...newUser,
      token: generateToken(newUser._id)
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
router.get('/users', protect, admin, async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
