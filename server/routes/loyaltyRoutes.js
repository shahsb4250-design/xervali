const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// GET /api/loyalty - Get current user's loyalty info
router.get('/', protect, async (req, res) => {
  try {
    const loyalty = await db.getUserLoyalty(req.user._id);
    res.json(loyalty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/loyalty/award - Award points (admin or system trigger)
router.post('/award', protect, async (req, res) => {
  try {
    const { userId, points } = req.body;
    const targetId = userId || req.user._id;
    const result = await db.updateLoyaltyPoints(targetId, points || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
