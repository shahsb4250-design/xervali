const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const coupons = await db.getCoupons();
    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });
    }
    const result = await db.validateCoupon(code, parseFloat(subtotal || 0));
    if (!result.valid) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// @desc    Create new coupon (admin)
// @route   POST /api/coupons
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchase, expiryDate } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ message: 'Code and discount value are required' });
    }
    const coupon = await db.createCoupon({
      code,
      discountType,
      discountValue,
      minPurchase,
      expiryDate
    });
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const success = await db.deleteCoupon(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
