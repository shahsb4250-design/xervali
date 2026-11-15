const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/export/orders - Download orders as CSV
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const csv = await db.exportOrdersCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="xervali-orders.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/export/products - Download products as CSV
router.get('/products', protect, admin, async (req, res) => {
  try {
    const csv = await db.exportProductsCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="xervali-products.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
