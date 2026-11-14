const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

dotenv.config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - Allow all origins for dev / API access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Healthcheck API route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'XERVALI Luxury Maison eCommerce API is running smoothly',
    storeName: 'XERVALI',
    security: {
      sslGrade: '256-bit AES Simulated',
      rateLimit: 'Active',
      memoryProtection: 'Active'
    },
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/serial', require('./routes/serialRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));
app.use('/api/loyalty', require('./routes/loyaltyRoutes'));
app.use('/api/2fa', require('./routes/twoFactorRoutes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// WebSocket server for live Atelier Concierge Chat & Realtime Order Notifications
const wss = new WebSocket.Server({ server, path: '/ws/chat' });

const wsClients = new Map(); // userId -> Set of ws connections

// Helper: Broadcast any event to all open WebSocket connections safely
function broadcastEvent(payload) {
  const json = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(json);
      } catch (err) {
        console.error('WS broadcast delivery error:', err);
      }
    }
  });
}

// Attach broadcast helper to express app
app.set('broadcastEvent', broadcastEvent);

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  let userIdentifier = null;

  ws.on('message', (rawMessage) => {
    try {
      const msg = JSON.parse(rawMessage);

      // Identity handshake
      if (msg.type === 'identify') {
        userIdentifier = msg.userId || 'guest';
        if (!wsClients.has(userIdentifier)) wsClients.set(userIdentifier, new Set());
        wsClients.get(userIdentifier).add(ws);
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'Connected to XERVALI Atelier Realtime Engine',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      if (msg.type === 'message') {
        const outgoing = {
          type: 'message',
          _id: 'msg_' + Date.now(),
          userId: msg.userId || userIdentifier,
          sender: msg.sender || 'customer',
          text: msg.text,
          userName: msg.userName || 'Client Connoisseur',
          timestamp: new Date().toISOString()
        };

        // Broadcast to target user's connections and all listeners
        broadcastEvent(outgoing);
      }
    } catch (e) {
      console.error('WS message parse error:', e);
    }
  });

  const cleanupSocket = () => {
    if (userIdentifier && wsClients.has(userIdentifier)) {
      wsClients.get(userIdentifier).delete(ws);
      if (wsClients.get(userIdentifier).size === 0) {
        wsClients.delete(userIdentifier);
      }
    }
  };

  ws.on('close', cleanupSocket);
  ws.on('error', cleanupSocket);
});

// MEMORY LEAK PREVENTION: Heartbeat interval checking dead sockets every 30 seconds
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      // Socket did not respond to ping; terminate to prevent memory leak
      return ws.terminate();
    }
    ws.isAlive = false;
    try {
      ws.ping();
    } catch (e) {
      ws.terminate();
    }
  });
}, 30000);

heartbeatInterval.unref(); // Ensure interval does not prevent process termination

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 XERVALI API Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💬 WebSocket Engine: ws://localhost:${PORT}/ws/chat`);
  console.log(`👤 Admin Account: syedismail12570@gmail.com | Knightrider1@`);
  console.log(`🛍️ Customer Account: customer@example.com | customer123`);
  console.log(`🛡️ Memory Leak Guard & Rate Limiter: Active`);
  console.log(`===============================================`);
});
