const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings - Admin only
router.put('/', protect, admin, async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
