const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/serial/:code - Public verification endpoint
router.get('/:code', async (req, res) => {
  try {
    const result = await db.verifySerial(req.params.code);
    if (!result) return res.status(404).json({ verified: false, message: 'No serial record found.' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
