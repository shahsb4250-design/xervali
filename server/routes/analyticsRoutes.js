const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get store sales analytics
// @route   GET /api/analytics
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const stats = await db.getSalesAnalytics();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
