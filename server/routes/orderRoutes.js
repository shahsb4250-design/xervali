const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items specified in order' });
    }

    const order = await db.createOrder({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Stripe',
      paymentResult: { id: 'mock_pay_' + Date.now(), status: 'succeeded' },
      itemsPrice: parseFloat(itemsPrice || 0),
      taxPrice: parseFloat(taxPrice || 0),
      shippingPrice: parseFloat(shippingPrice || 0),
      discountAmount: parseFloat(discountAmount || 0),
      totalPrice: parseFloat(totalPrice || 0),
      isPaid: true,
      paidAt: new Date().toISOString()
    });

    // Realtime notification broadcast to Admin Suite
    const broadcastEvent = req.app.get('broadcastEvent');
    if (typeof broadcastEvent === 'function') {
      broadcastEvent({
        type: 'new_order',
        notification: order.notification || {
          _id: 'notif_' + Date.now(),
          type: 'new_order',
          title: 'New Haute Commission Received',
          orderNumber: order.orderNumber,
          orderId: order._id,
          customerName: req.user.name,
          customerEmail: req.user.email,
          totalPrice: order.totalPrice,
          itemsCount: (order.orderItems || []).reduce((sum, i) => sum + (i.qty || 1), 0),
          createdAt: order.createdAt,
          read: false
        }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await db.getUserOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Allow admin or the owner
    if (!req.user.isAdmin && order.user._id !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const orders = await db.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }
    const order = await db.updateOrderStatus(req.params.id, { status, trackingNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
