const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '') + '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('luxe_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  googleLogin: (googleData) => request('/auth/google', { method: 'POST', body: JSON.stringify(googleData) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/profile'),
  getUsers: () => request('/auth/users'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  addReview: (id, review) => request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(review) }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my'),
  getOrderById: (id) => request(`/orders/${id}`),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, data) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Coupons
  getCoupons: () => request('/coupons'),
  validateCoupon: (code, subtotal) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  createCoupon: (data) => request('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => request('/analytics'),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId) => request('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Loyalty Program
  getLoyalty: () => request('/loyalty'),
  awardLoyaltyPoints: (points, userId) => request('/loyalty/award', { method: 'POST', body: JSON.stringify({ points, userId }) }),

  // Serial Verification & Authenticity
  verifySerial: (code) => request(`/serial/${encodeURIComponent(code)}`),

  // Settings & Announcement Bar
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Atelier Concierge Live Chat
  getChatConversations: () => request('/chat/conversations'),
  getChatMessages: (userId) => request(userId ? `/chat/messages/${userId}` : '/chat/my'),
  sendChatMessage: (text) => request('/chat/send', { method: 'POST', body: JSON.stringify({ text }) }),
  sendAdminMessage: (targetUserId, text) => request('/chat/send', { method: 'POST', body: JSON.stringify({ targetUserId, text }) }),

  // 2FA Admin Security
  get2FAStatus: () => request('/2fa/status'),
  toggle2FA: (data) => request('/2fa/toggle', { method: 'POST', body: JSON.stringify(data) }),

  // Order Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
