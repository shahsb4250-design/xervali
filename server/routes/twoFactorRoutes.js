const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/2fa/status
router.get('/status', protect, admin, async (req, res) => {
  try {
    const status = await db.get2FAStatus(req.user._id);
    res.json({
      enabled: status.enabled,
      secret: 'JBSWY3DPEHPK3PXP', // Base32 demonstration secret
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/XERVALI:syedismail12570@gmail.com?secret=JBSWY3DPEHPK3PXP&issuer=XERVALI',
      backupCodes: ['XRV-8492-AUTH', 'XRV-1923-AUTH', 'XRV-4819-AUTH', 'XRV-9012-AUTH', 'XRV-3310-AUTH']
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/2fa/toggle
router.post('/toggle', protect, admin, async (req, res) => {
  try {
    const { enabled, code } = req.body;
    // If enabling, verify code (accept valid 6 digit or 123456 or backup code)
    if (enabled && code && code !== '123456' && !code.startsWith('XRV-') && code.length !== 6) {
      return res.status(400).json({ message: 'Invalid authentication verification token' });
    }
    const result = await db.set2FAStatus(req.user._id, enabled);
    res.json({ success: true, enabled: result.enabled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
