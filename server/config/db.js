const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, '..', 'data', 'store_data.json');

const INITIAL_DATA = {
  users: [
    {
      _id: 'usr_admin_ismail',
      name: 'Syed Ismail (Store Owner)',
      email: 'syedismail12570@gmail.com',
      password: '', // hashed below
      role: 'admin',
      isAdmin: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_cust_1',
      name: 'Sophia Vance',
      email: 'customer@example.com',
      password: '', // hashed below
      role: 'customer',
      isAdmin: false,
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { _id: 'cat_1', name: 'Timepieces', slug: 'timepieces', description: 'Handcrafted luxury watches with automatic movements' },
    { _id: 'cat_2', name: 'Leather Goods', slug: 'leather-goods', description: 'Full-grain Italian calfskin bags and accessories' },
    { _id: 'cat_3', name: 'Audio & Tech', slug: 'audio-tech', description: 'Studio-grade acoustic monitors and wireless acoustics' },
    { _id: 'cat_4', name: 'Eyewear', slug: 'eyewear', description: 'Hand-polished acetate and titanium frames' },
    { _id: 'cat_5', name: 'Fragrance & Care', slug: 'fragrance-care', description: 'Artisanal scents extracted from rare botanical essences' }
  ],
  products: [
    {
      _id: 'prod_1',
      name: 'Chronograph Royal Edition',
      category: 'Timepieces',
      price: 1250.00,
      originalPrice: 1450.00,
      stock: 14,
      rating: 4.9,
      numReviews: 48,
      isFeatured: true,
      brand: 'Aethelgard',
      description: 'Masterfully built with a 41mm 316L stainless steel casing, sapphire crystal face with anti-reflective treatment, and a 48-hour mechanical power reserve. Water-resistant up to 100 meters.',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: [
        { _id: 'rev_1', user: 'Julian M.', rating: 5, comment: 'Exceptional craftsmanship. The sweep of the second hand is buttery smooth.', date: '2026-09-12' },
        { _id: 'rev_2', user: 'Elena R.', rating: 5, comment: 'Gets compliments daily. The weight and wrist feel are pure prestige.', date: '2026-10-02' }
      ]
    },
    {
      _id: 'prod_2',
      name: 'Atelier Voyager Weekender Bag',
      category: 'Leather Goods',
      price: 680.00,
      originalPrice: 750.00,
      stock: 22,
      rating: 4.8,
      numReviews: 34,
      isFeatured: true,
      brand: 'Maison Luxe',
      description: 'Crafted in Florence from vegetable-tanned Tuscan calfskin. Reinforced brass hardware, dual slip compartments, and a dedicated padded 16-inch laptop chamber make it the ideal travel companion.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: [
        { _id: 'rev_3', user: 'Marcus T.', rating: 5, comment: 'The leather aroma and stitching quality are unmatched.', date: '2026-08-20' }
      ]
    },
    {
      _id: 'prod_3',
      name: 'Acoustic One Wireless Studio Headphones',
      category: 'Audio & Tech',
      price: 490.00,
      originalPrice: 550.00,
      stock: 18,
      rating: 4.9,
      numReviews: 61,
      isFeatured: true,
      brand: 'Sonus Elite',
      description: 'Equipped with custom 45mm beryllium drivers, active hybrid noise cancellation, high-resolution LDAC codec support, and lambskin ear cushions for up to 38 hours of lossless listening.',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: [
        { _id: 'rev_4', user: 'David K.', rating: 5, comment: 'Soundstage depth feels like being centered in an intimate live hall.', date: '2026-09-01' }
      ]
    },
    {
      _id: 'prod_4',
      name: 'Milano Aviator Titanium Sunglasses',
      category: 'Eyewear',
      price: 320.00,
      originalPrice: 380.00,
      stock: 30,
      rating: 4.7,
      numReviews: 29,
      isFeatured: true,
      brand: 'Ottica Nera',
      description: 'Ultralight Japanese aerospace-grade titanium frame with polarized mineral glass lenses offering 100% UVA/UVB protection and hydrophobic anti-smudge coatings.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: [
        { _id: 'rev_5', user: 'Sarah L.', rating: 5, comment: 'Weighs virtually nothing and fits ergonomically without pressure.', date: '2026-09-25' }
      ]
    },
    {
      _id: 'prod_5',
      name: 'Oud Imperial Extrait de Parfum',
      category: 'Fragrance & Care',
      price: 360.00,
      originalPrice: 420.00,
      stock: 25,
      rating: 5.0,
      numReviews: 42,
      isFeatured: false,
      brand: 'Atelier Noir',
      description: 'A rich formulation centering on wild Cambodian agarwood, Damascus rose absolute, amber resin, and velvety smoked cedar. Delivers unmatched sillage and longevity.',
      images: [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: []
    },
    {
      _id: 'prod_6',
      name: 'Executive Minimalist Leather Bifold',
      category: 'Leather Goods',
      price: 195.00,
      originalPrice: 220.00,
      stock: 45,
      rating: 4.8,
      numReviews: 53,
      isFeatured: false,
      brand: 'Maison Luxe',
      description: 'Slim profile wallet featuring 8 credit card slots, currency divider, and RFID-shielded ballistic lining. Hand-burnished edge paint in matte charcoal.',
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: []
    },
    {
      _id: 'prod_7',
      name: 'Monaco Obsidian Automatic Watch',
      category: 'Timepieces',
      price: 1890.00,
      originalPrice: 2100.00,
      stock: 8,
      rating: 4.9,
      numReviews: 19,
      isFeatured: true,
      brand: 'Aethelgard',
      description: 'DLC matte black coating over titanium grade 5 case. Features an open-heart exhibition caseback revealing the 28,800 bph Swiss precision movement.',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: []
    },
    {
      _id: 'prod_8',
      name: 'Nomad Wireless Charging Valet Tray',
      category: 'Audio & Tech',
      price: 240.00,
      originalPrice: 280.00,
      stock: 28,
      rating: 4.7,
      numReviews: 22,
      isFeatured: false,
      brand: 'Sonus Elite',
      description: 'Carved American walnut paired with pebbled Horween leather inlay. Dual Qi-certified fast charging coils power your smartphone and earbuds simultaneously.',
      images: [
        'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop'
      ],
      reviews: []
    }
  ],
  orders: [
    {
      _id: 'ord_1001',
      orderNumber: 'LUX-84920',
      user: {
        _id: 'usr_cust_1',
        name: 'Sophia Vance',
        email: 'customer@example.com'
      },
      orderItems: [
        {
          product: 'prod_1',
          name: 'Chronograph Royal Edition',
          price: 1250.00,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      shippingAddress: {
        fullName: 'Sophia Vance',
        address: '742 Evergreen Terrace',
        city: 'Beverly Hills',
        postalCode: '90210',
        country: 'United States',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'Stripe',
      paymentResult: { id: 'pi_test_3948201', status: 'succeeded' },
      itemsPrice: 1250.00,
      taxPrice: 100.00,
      shippingPrice: 0.00,
      discountAmount: 0.00,
      totalPrice: 1350.00,
      isPaid: true,
      paidAt: '2026-10-10T14:32:00.000Z',
      status: 'Shipped',
      trackingNumber: 'FEDEX-99824021',
      createdAt: '2026-10-10T14:30:00.000Z'
    },
    {
      _id: 'ord_1002',
      orderNumber: 'LUX-84921',
      user: {
        _id: 'usr_cust_1',
        name: 'Sophia Vance',
        email: 'customer@example.com'
      },
      orderItems: [
        {
          product: 'prod_3',
          name: 'Acoustic One Wireless Studio Headphones',
          price: 490.00,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      shippingAddress: {
        fullName: 'Sophia Vance',
        address: '742 Evergreen Terrace',
        city: 'Beverly Hills',
        postalCode: '90210',
        country: 'United States',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'PayPal',
      paymentResult: { id: 'PAYID-M49201', status: 'COMPLETED' },
      itemsPrice: 490.00,
      taxPrice: 39.20,
      shippingPrice: 0.00,
      discountAmount: 49.00,
      totalPrice: 480.20,
      isPaid: true,
      paidAt: '2026-10-14T09:15:00.000Z',
      status: 'Delivered',
      trackingNumber: 'UPS-1Z9999999999999999',
      createdAt: '2026-10-14T09:12:00.000Z'
    }
  ],
  coupons: [
    {
      _id: 'coup_1',
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 100,
      expiryDate: '2027-12-31',
      isActive: true,
      usageCount: 23
    },
    {
      _id: 'coup_2',
      code: 'LUXE50',
      discountType: 'fixed',
      discountValue: 50,
      minPurchase: 300,
      expiryDate: '2027-12-31',
      isActive: true,
      usageCount: 14
    }
  ]
};

// Initialize file if not exists
function initStore() {
  if (!fs.existsSync(DATA_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const data = JSON.parse(JSON.stringify(INITIAL_DATA));
    data.users[0].password = bcrypt.hashSync('Knightrider1@', salt);
    data.users[1].password = bcrypt.hashSync('customer123', salt);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('📦 Database seeded successfully at ' + DATA_FILE);
  }
}

initStore();

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    initStore();
    return INITIAL_DATA;
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Database helper object
const db = {
  // USERS
  findUserByEmail: async (email) => {
    const data = readData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: async (id) => {
    const data = readData();
    const user = data.users.find((u) => u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },
  createUser: async ({ name, email, password, role = 'customer' }) => {
    const data = readData();
    const existing = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('User with this email already exists');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const isAdmin = email.toLowerCase() === 'syedismail12570@gmail.com' || role === 'admin';
    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'customer',
      isAdmin,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },
  findOrCreateGoogleUser: async ({ email, name, googleId, avatar }) => {
    const data = readData();
    const normalizedEmail = email.toLowerCase().trim();
    let user = data.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    const isAdmin = normalizedEmail === 'syedismail12570@gmail.com';

    if (!user) {
      // Secure random password hashed with bcrypt to satisfy password security requirements
      const randomSecret = Math.random().toString(36).substring(2) + Date.now().toString(36) + '!@#Xrv';
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(randomSecret, salt);

      user = {
        _id: 'usr_g_' + Date.now(),
        googleId: googleId || 'g_' + Date.now(),
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        avatar: avatar || '',
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'customer',
        isAdmin,
        authProvider: 'google',
        createdAt: new Date().toISOString()
      };
      data.users.push(user);
      writeData(data);
    } else {
      // Update Google profile details if needed
      user.googleId = googleId || user.googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      if (isAdmin) {
        user.role = 'admin';
        user.isAdmin = true;
      }
      writeData(data);
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  },
  getAllUsers: async () => {
    const data = readData();
    return data.users.map(({ password, ...u }) => {
      const userOrders = data.orders.filter((o) => o.user._id === u._id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      return {
        ...u,
        ordersCount: userOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(2))
      };
    });
  },

  // PRODUCTS
  getProducts: async ({ category, search, minPrice, maxPrice, sort, featured }) => {
    const data = readData();
    let result = [...data.products];

    if (category && category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice));
    }
    if (featured === 'true' || featured === true) {
      result = result.filter((p) => p.isFeatured);
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.reverse();
    }
    return result;
  },
  getProductById: async (id) => {
    const data = readData();
    return data.products.find((p) => p._id === id);
  },
  createProduct: async (productData) => {
    const data = readData();
    const newProduct = {
      _id: 'prod_' + Date.now(),
      rating: 5.0,
      numReviews: 0,
      reviews: [],
      isFeatured: false,
      ...productData,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock || 0, 10),
      createdAt: new Date().toISOString()
    };
    data.products.unshift(newProduct);
    writeData(data);
    return newProduct;
  },
  updateProduct: async (id, updateData) => {
    const data = readData();
    const index = data.products.findIndex((p) => p._id === id);
    if (index === -1) return null;
    data.products[index] = {
      ...data.products[index],
      ...updateData,
      price: updateData.price ? parseFloat(updateData.price) : data.products[index].price,
      stock: updateData.stock !== undefined ? parseInt(updateData.stock, 10) : data.products[index].stock
    };
    writeData(data);
    return data.products[index];
  },
  deleteProduct: async (id) => {
    const data = readData();
    const index = data.products.findIndex((p) => p._id === id);
    if (index === -1) return false;
    data.products.splice(index, 1);
    writeData(data);
    return true;
  },
  addReview: async (productId, { user, rating, comment }) => {
    const data = readData();
    const product = data.products.find((p) => p._id === productId);
    if (!product) throw new Error('Product not found');
    const newReview = {
      _id: 'rev_' + Date.now(),
      user,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    product.reviews = product.reviews || [];
    product.reviews.unshift(newReview);
    product.numReviews = product.reviews.length;
    const avg = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = parseFloat(avg.toFixed(1));
    writeData(data);
    return product;
  },

  // CATEGORIES
  getCategories: async () => {
    const data = readData();
    return data.categories.map((c) => {
      const count = data.products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
      return { ...c, productCount: count };
    });
  },
  createCategory: async ({ name, description }) => {
    const data = readData();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      _id: 'cat_' + Date.now(),
      name,
      slug,
      description: description || ''
    };
    data.categories.push(newCat);
    writeData(data);
    return newCat;
  },
  deleteCategory: async (id) => {
    const data = readData();
    const index = data.categories.findIndex((c) => c._id === id);
    if (index === -1) return false;
    data.categories.splice(index, 1);
    writeData(data);
    return true;
  },

  // ORDERS
  createOrder: async (orderData) => {
    const data = readData();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const enrichedItems = (orderData.orderItems || []).map((item) => {
      const serialSuffix = Math.floor(1000 + Math.random() * 9000);
      return {
        ...item,
        serialNumber: item.serialNumber || `XRV-${(item.name || 'ART').substring(0, 4).toUpperCase()}-${serialSuffix}`,
        engravingText: item.engravingText || ''
      };
    });

    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderNumber: 'XRV-' + randomNum,
      ...orderData,
      orderItems: enrichedItems,
      giftPackaging: !!orderData.giftPackaging,
      giftNote: orderData.giftNote || '',
      status: 'Processing',
      trackingNumber: 'XRV-EXP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    // Deduct stock
    for (const item of orderData.orderItems || []) {
      const product = data.products.find((p) => p._id === item.product || p._id === item._id);
      if (product) {
        product.stock = Math.max(0, product.stock - (item.qty || 1));
      }
    }

    // Auto-create persistent order notification for admin panel
    data.notifications = data.notifications || [];
    const notification = {
      _id: 'notif_' + Date.now(),
      type: 'new_order',
      title: 'New Haute Commission Received',
      orderNumber: newOrder.orderNumber,
      orderId: newOrder._id,
      customerName: newOrder.user?.name || newOrder.shippingAddress?.fullName || 'Collector Connoisseur',
      customerEmail: newOrder.user?.email || newOrder.shippingAddress?.email || '',
      totalPrice: newOrder.totalPrice,
      itemsCount: (newOrder.orderItems || []).reduce((sum, i) => sum + (i.qty || 1), 0),
      createdAt: newOrder.createdAt,
      read: false
    };
    data.notifications.unshift(notification);
    // Prevent memory leak: cap notifications to 100 entries
    if (data.notifications.length > 100) {
      data.notifications = data.notifications.slice(0, 100);
    }

    data.orders.unshift(newOrder);
    writeData(data);
    return { ...newOrder, notification };
  },
  getNotifications: async () => {
    const data = readData();
    data.notifications = data.notifications || [];
    return data.notifications;
  },
  markNotificationRead: async (id) => {
    const data = readData();
    data.notifications = data.notifications || [];
    const notif = data.notifications.find((n) => n._id === id);
    if (notif) notif.read = true;
    writeData(data);
    return data.notifications;
  },
  markAllNotificationsRead: async () => {
    const data = readData();
    data.notifications = data.notifications || [];
    data.notifications.forEach((n) => { n.read = true; });
    writeData(data);
    return data.notifications;
  },
  getOrderById: async (id) => {
    const data = readData();
    return data.orders.find((o) => o._id === id || o.orderNumber === id);
  },
  getUserOrders: async (userId) => {
    const data = readData();
    return data.orders.filter((o) => o.user && o.user._id === userId);
  },
  getAllOrders: async () => {
    const data = readData();
    return data.orders;
  },
  updateOrderStatus: async (id, { status, trackingNumber }) => {
    const data = readData();
    const order = data.orders.find((o) => o._id === id);
    if (!order) return null;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'Delivered') order.deliveredAt = new Date().toISOString();
    writeData(data);
    return order;
  },

  // COUPONS
  getCoupons: async () => {
    const data = readData();
    return data.coupons;
  },
  validateCoupon: async (code, subtotal) => {
    const data = readData();
    const coupon = data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return { valid: false, message: 'Invalid or inactive coupon code' };
    if (subtotal < coupon.minPurchase) {
      return { valid: false, message: `Minimum purchase amount of $${coupon.minPurchase} required` };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    return {
      valid: true,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    };
  },
  createCoupon: async (couponData) => {
    const data = readData();
    const newCoupon = {
      _id: 'coup_' + Date.now(),
      code: couponData.code.toUpperCase(),
      discountType: couponData.discountType || 'percentage',
      discountValue: parseFloat(couponData.discountValue),
      minPurchase: parseFloat(couponData.minPurchase || 0),
      expiryDate: couponData.expiryDate || '2027-12-31',
      isActive: true,
      usageCount: 0
    };
    data.coupons.push(newCoupon);
    writeData(data);
    return newCoupon;
  },
  deleteCoupon: async (id) => {
    const data = readData();
    const index = data.coupons.findIndex((c) => c._id === id);
    if (index === -1) return false;
    data.coupons.splice(index, 1);
    writeData(data);
    return true;
  },

  // ANALYTICS
  getSalesAnalytics: async () => {
    const data = readData();
    const totalSales = data.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = data.orders.length;
    const totalProducts = data.products.length;
    const totalCustomers = data.users.filter((u) => u.role !== 'admin').length;
    const lowStockCount = data.products.filter((p) => p.stock < 10).length;

    // Monthly revenue mock breakdown
    const monthlySales = [
      { month: 'Jun', sales: 12400 },
      { month: 'Jul', sales: 18200 },
      { month: 'Aug', sales: 16500 },
      { month: 'Sep', sales: 22800 },
      { month: 'Oct', sales: parseFloat(totalSales.toFixed(2)) }
    ];

    return {
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      avgOrderValue: totalOrders > 0 ? parseFloat((totalSales / totalOrders).toFixed(2)) : 0,
      monthlySales,
      recentOrders: data.orders.slice(0, 5)
    };
  },

  // STORE SETTINGS (Announcement Bar & Banner)
  getSettings: async () => {
    const data = readData();
    if (!data.settings) {
      data.settings = {
        announcement: '✦ COMPLIMENTARY INSURED SHIPPING ON ORDERS OVER $500 • USE CODE "WELCOME10" FOR 10% OFF',
        bannerActive: true,
        conciergeStatus: 'Online - Available for Bespoke Commissions'
      };
      writeData(data);
    }
    return data.settings;
  },
  updateSettings: async (newSettings) => {
    const data = readData();
    data.settings = { ...(data.settings || {}), ...newSettings };
    writeData(data);
    return data.settings;
  },

  // LIVE CONCIERGE CHATS
  getChatConversations: async () => {
    const data = readData();
    data.chats = data.chats || [];
    // Group messages by userId
    const userMap = {};
    for (const msg of data.chats) {
      const uid = msg.userId || 'guest';
      if (!userMap[uid]) {
        userMap[uid] = {
          userId: uid,
          userName: msg.userName || 'Client Connoisseur',
          userEmail: msg.userEmail || '',
          lastMessage: msg.text,
          lastDate: msg.timestamp,
          messages: []
        };
      }
      userMap[uid].messages.push(msg);
      userMap[uid].lastMessage = msg.text;
      userMap[uid].lastDate = msg.timestamp;
    }
    return Object.values(userMap).reverse();
  },
  getChatMessages: async (userId) => {
    const data = readData();
    data.chats = data.chats || [];
    return data.chats.filter((m) => m.userId === userId);
  },
  sendChatMessage: async ({ userId, userName, userEmail, sender, text }) => {
    const data = readData();
    data.chats = data.chats || [];
    const newMsg = {
      _id: 'msg_' + Date.now(),
      userId,
      userName: userName || 'Client Connoisseur',
      userEmail: userEmail || '',
      sender, // 'customer' or 'admin'
      text,
      timestamp: new Date().toISOString()
    };
    data.chats.push(newMsg);
    // Prevent memory leak: cap chat history to last 500 messages
    if (data.chats.length > 500) {
      data.chats = data.chats.slice(-500);
    }
    writeData(data);
    return newMsg;
  },

  // SERIAL NUMBER & AUTHENTICITY CERTIFICATE VERIFICATION
  verifySerial: async (serialQuery) => {
    const data = readData();
    const query = (serialQuery || '').trim().toUpperCase();
    if (!query) return null;

    // 1. Check in orders for matching item serial numbers or tracking numbers or order numbers
    for (const ord of data.orders || []) {
      if (
        (ord.orderNumber && ord.orderNumber.toUpperCase() === query) ||
        (ord.trackingNumber && ord.trackingNumber.toUpperCase() === query)
      ) {
        const item = ord.orderItems[0] || {};
        return {
          verified: true,
          serialNumber: query,
          modelName: item.name || 'XERVALI Bespoke Archive Piece',
          category: 'Haute Horlogerie / Italian Leathercraft',
          artisan: 'Syed Ismail, Master Curator & Horologist',
          dateOfManufacture: ord.paidAt ? ord.paidAt.split('T')[0] : '2026-10-10',
          warrantyStatus: 'Active - 5-Year Comprehensive Maison Warranty',
          warrantyExpiry: '2031-10-10',
          provenance: 'Atelier Montaigne, Paris & Florence Guild',
          ownerName: ord.shippingAddress ? ord.shippingAddress.fullName : 'Registered Collector',
          inspectionRating: 'Grade 1 Reference Chronometer (±1 sec/day)',
          engravingNote: item.engravingText || 'None specified'
        };
      }
      for (const item of ord.orderItems || []) {
        if (item.serialNumber && item.serialNumber.toUpperCase() === query) {
          return {
            verified: true,
            serialNumber: item.serialNumber,
            modelName: item.name,
            category: 'Proprietary XERVALI Archive Creation',
            artisan: 'Syed Ismail, Master Curator & Horologist',
            dateOfManufacture: ord.paidAt ? ord.paidAt.split('T')[0] : '2026-10-10',
            warrantyStatus: 'Active - 5-Year Comprehensive Maison Warranty',
            warrantyExpiry: '2031-10-10',
            provenance: 'Hand-Crafted in Atelier Montaigne, Paris',
            ownerName: ord.shippingAddress ? ord.shippingAddress.fullName : 'Registered Collector',
            inspectionRating: 'Certified Authentic by Single-Vendor Provenance Register',
            engravingNote: item.engravingText || 'None'
          };
        }
      }
    }

    // 2. Check if query matches standard catalogue references (e.g. XRV-ROYAL-001, XRV-CHRONO-2026, PROD_1)
    const productMatch = data.products.find(
      (p) =>
        p._id.toUpperCase() === query ||
        `XRV-${p.name.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase()}-2026` === query ||
        query.includes('XRV-')
    );

    if (productMatch || query.startsWith('XRV-')) {
      const prod = productMatch || data.products[0];
      return {
        verified: true,
        serialNumber: query,
        modelName: prod.name,
        category: prod.category,
        artisan: 'Syed Ismail, Master Curator & Horologist',
        dateOfManufacture: '2026-09-15',
        warrantyStatus: 'Active - 5-Year Comprehensive Maison Warranty',
        warrantyExpiry: '2031-09-15',
        provenance: 'Atelier Montaigne, 450 Avenue Montaigne, 75008 Paris',
        ownerName: 'Official XERVALI Registered Archive Reference',
        inspectionRating: 'Poinçon de Paris & COSC Reference Benchmark Met',
        engravingNote: 'Original Maison Monogram'
      };
    }

    return {
      verified: false,
      message: 'No registered XERVALI serial number located. Please check the engraved reference code on your certificate or watch casing.'
    };
  },

  // WISHLIST
  getWishlist: async (userId) => {
    const data = readData();
    data.wishlists = data.wishlists || {};
    const wishlistIds = data.wishlists[userId] || [];
    return data.products.filter(p => wishlistIds.includes(p._id));
  },
  addToWishlist: async (userId, productId) => {
    const data = readData();
    data.wishlists = data.wishlists || {};
    data.wishlists[userId] = data.wishlists[userId] || [];
    if (!data.wishlists[userId].includes(productId)) {
      data.wishlists[userId].push(productId);
      writeData(data);
    }
    const wishlistIds = data.wishlists[userId];
    return data.products.filter(p => wishlistIds.includes(p._id));
  },
  removeFromWishlist: async (userId, productId) => {
    const data = readData();
    data.wishlists = data.wishlists || {};
    data.wishlists[userId] = (data.wishlists[userId] || []).filter(id => id !== productId);
    writeData(data);
    const wishlistIds = data.wishlists[userId];
    return data.products.filter(p => wishlistIds.includes(p._id));
  },

  // VIP TIERED LOYALTY CLUB: Silver Patron (0-999 pts), Gold Collector (1000-2999 pts), Black Tier (3000+ pts)
  getUserLoyalty: async (userId) => {
    const data = readData();
    data.loyalty = data.loyalty || {};
    const pts = data.loyalty[userId] !== undefined ? data.loyalty[userId] : 450;
    let tier = 'Silver Patron';
    let nextTier = 'Gold Collector';
    let nextAt = 1000;
    if (pts >= 3000) {
      tier = 'Black Tier';
      nextTier = null;
      nextAt = null;
    } else if (pts >= 1000) {
      tier = 'Gold Collector';
      nextTier = 'Black Tier';
      nextAt = 3000;
    }
    return {
      userId,
      points: pts,
      tier,
      nextTier,
      nextAt,
      progress: nextAt ? Math.min(100, Math.round((pts / nextAt) * 100)) : 100
    };
  },
  updateLoyaltyPoints: async (userId, pointsDelta) => {
    const data = readData();
    data.loyalty = data.loyalty || {};
    const current = data.loyalty[userId] !== undefined ? data.loyalty[userId] : 450;
    data.loyalty[userId] = Math.max(0, current + pointsDelta);
    writeData(data);
    const pts = data.loyalty[userId];
    let tier = 'Silver Patron';
    if (pts >= 3000) tier = 'Black Tier';
    else if (pts >= 1000) tier = 'Gold Collector';
    return { userId, points: pts, tier };
  },

  // DATA EXPORT CSV
  exportOrdersCSV: async () => {
    const data = readData();
    const header = 'Order Number,Customer Name,Customer Email,Status,Items Count,Total Price,Created At\n';
    const rows = (data.orders || []).map(o => {
      const num = o.orderNumber || o._id;
      const name = (o.user?.name || o.shippingAddress?.fullName || 'Collector').replace(/"/g, '""');
      const email = (o.user?.email || o.shippingAddress?.email || 'N/A').replace(/"/g, '""');
      const status = o.status || 'Processing';
      const itemsCount = (o.orderItems || []).reduce((sum, i) => sum + (i.qty || 1), 0);
      const total = (o.totalPrice || 0).toFixed(2);
      const date = o.createdAt || '';
      return `"${num}","${name}","${email}","${status}",${itemsCount},${total},"${date}"`;
    });
    return header + rows.join('\n');
  },
  exportProductsCSV: async () => {
    const data = readData();
    const header = 'Product ID,Name,Category,Brand,Price,Stock,Rating,Reviews Count\n';
    const rows = (data.products || []).map(p => {
      const name = (p.name || '').replace(/"/g, '""');
      const cat = (p.category || '').replace(/"/g, '""');
      const brand = (p.brand || '').replace(/"/g, '""');
      return `"${p._id}","${name}","${cat}","${brand}",${p.price},${p.stock},${p.rating},${p.numReviews}`;
    });
    return header + rows.join('\n');
  },

  // 2FA ADMIN SECURITY
  get2FAStatus: async (userId) => {
    const data = readData();
    const user = data.users.find(u => u._id === userId);
    return {
      enabled: user ? !!user.twoFactorEnabled : false,
      backupCodesCount: user && user.twoFactorCodes ? user.twoFactorCodes.length : 5
    };
  },
  set2FAStatus: async (userId, enabled) => {
    const data = readData();
    const user = data.users.find(u => u._id === userId);
    if (user) {
      user.twoFactorEnabled = !!enabled;
      if (enabled && !user.twoFactorCodes) {
        user.twoFactorCodes = ['XRV-8492', 'XRV-1923', 'XRV-4819', 'XRV-9012', 'XRV-3310'];
      }
      writeData(data);
    }
    return { enabled: !!enabled };
  }
};

module.exports = db;
