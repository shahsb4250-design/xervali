const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// GET /api/wishlist - Get my wishlist
router.get('/', protect, async (req, res) => {
  try {
    const items = await db.getWishlist(req.user._id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist - Add product to wishlist
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const items = await db.addToWishlist(req.user._id, productId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete('/:productId', protect, async (req, res) => {
  try {
    const items = await db.removeFromWishlist(req.user._id, req.params.productId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
