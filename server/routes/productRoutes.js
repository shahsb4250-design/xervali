const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
    const products = await db.getProducts({ category, search, minPrice, maxPrice, sort, featured });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// @desc    Create product (admin only)
// @route   POST /api/products
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, category, price, originalPrice, stock, brand, description, images, isFeatured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }
    const newProduct = await db.createProduct({
      name,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock || 0, 10),
      brand: brand || 'Luxe House',
      description: description || '',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
      isFeatured: !!isFeatured
    });
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product successfully removed' });
  } catch (err) {
    next(err);
  }
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }
    const updated = await db.addReview(req.params.id, {
      user: req.user.name,
      rating,
      comment
    });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
