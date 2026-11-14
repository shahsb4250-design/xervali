const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all admin notifications
// @route   GET /api/notifications
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const notifications = await db.getNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({
      notifications,
      unreadCount
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, admin, async (req, res, next) => {
  try {
    const updated = await db.markNotificationRead(req.params.id);
    const unreadCount = updated.filter((n) => !n.read).length;
    res.json({
      notifications: updated,
      unreadCount
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
router.put('/read-all', protect, admin, async (req, res, next) => {
  try {
    const updated = await db.markAllNotificationsRead();
    res.json({
      notifications: updated,
      unreadCount: 0
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
