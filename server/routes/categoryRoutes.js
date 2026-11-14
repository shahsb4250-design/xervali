const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all categories
// @route   GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// @desc    Create category (admin only)
// @route   POST /api/categories
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const category = await db.createCategory({ name, description });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

// @desc    Delete category (admin only)
// @route   DELETE /api/categories/:id
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const success = await db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
