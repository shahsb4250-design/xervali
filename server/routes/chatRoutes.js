const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all conversations (admin only)
router.get('/conversations', protect, admin, async (req, res) => {
  try {
    const convos = await db.getChatConversations();
    res.json(convos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET messages for a specific user
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const msgs = await db.getChatMessages(req.params.userId);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET own messages (customer)
router.get('/my', protect, async (req, res) => {
  try {
    const msgs = await db.getChatMessages(req.user._id);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST send message
router.post('/send', protect, async (req, res) => {
  try {
    const { text, sender, targetUserId } = req.body;
    const userId = req.user.isAdmin ? (targetUserId || req.user._id) : req.user._id;
    const msg = await db.sendChatMessage({
      userId,
      userName: req.user.name,
      userEmail: req.user.email,
      sender: req.user.isAdmin ? 'admin' : 'customer',
      text
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
