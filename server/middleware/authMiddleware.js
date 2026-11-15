const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'luxe_secret_key_2026_jwt_token_auth';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found or authorization revoked' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Authorization required, no Bearer token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
};

module.exports = { protect, admin, JWT_SECRET };
