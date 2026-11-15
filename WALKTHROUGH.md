# XERVALI - Single-Vendor Enterprise eCommerce Platform

## 1. Executive Architecture Overview

XERVALI is a full-featured, production-ready, single-vendor luxury eCommerce platform. Unlike multi-vendor marketplaces (e.g. Amazon, eBay), XERVALI is architected specifically for an exclusive single brand/store owner who manufactures, archives, and sells their proprietary catalogue directly to discerning clients.

- **Frontend**: React 18 + Vite with Tailwind CSS and Lucide React icons.
- **Backend**: Node.js + Express REST API with JWT authentication & Bcrypt password encryption.
- **Data Persistence**: Dual-mode data persistence engine supporting MongoDB (Mongoose) or relational PostgreSQL, with automated zero-config fallback.
- **Security**: Role-Based Access Control (`admin` vs `customer`), Bearer JWT verification, input sanitization, and route protection.

---

## 2. Live Application Endpoints & Demo Credentials

### 🔗 Application URLs
- **Web Boutique (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **API Healthcheck (Backend)**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Boutique Shop**: [http://localhost:3000/shop](http://localhost:3000/shop)
- **Shopping Bag**: [http://localhost:3000/cart](http://localhost:3000/cart)
- **Order Tracking**: [http://localhost:3000/orders](http://localhost:3000/orders)
- **Admin Suite**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 🔑 Credentials (1-Click Login available on Login page)
- **Sole Store Owner (Administrator)**:
  - Email: `syedismail12570@gmail.com`
  - Password: `Knightrider1@`
  - Access: Full control over products, orders, categories, coupons, and analytics.
- **Collector (Customer)**:
  - Email: `customer@example.com`
  - Password: `customer123`
  - Access: Browsing, bag management, checkout, reviews, and tracking.
- **Promotional Coupon Codes**:
  - `WELCOME10` (10% off any order over $100)
  - `LUXE50` ($50 flat off orders over $300)

---

## 3. Database Schema

### A. MongoDB / Mongoose Schemas

#### 1. User Schema (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String },
  addresses: [{
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  }]
}, { timestamps: true });
```

#### 2. Product Schema (`models/Product.js`)
```javascript
const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, default: 'LUXE Atelier' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  stock: { type: Number, required: true, default: 0, min: 0 },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  rating: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  reviews: [reviewSchema]
}, { timestamps: true });
```

#### 3. Category Schema (`models/Category.js`)
```javascript
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });
```

#### 4. Order Schema (`models/Order.js`)
```javascript
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, enum: ['Stripe', 'PayPal', 'ConciergeWire'] },
  paymentResult: { id: String, status: String },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: true },
  paidAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  trackingNumber: { type: String },
  deliveredAt: { type: Date }
}, { timestamps: true });
```

#### 5. Coupon Schema (`models/Coupon.js`)
```javascript
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });
```

---

### B. PostgreSQL Relational SQL DDL (Production Option)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100) DEFAULT 'LUXE Atelier',
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INTEGER DEFAULT 0,
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  num_reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  payment_method VARCHAR(50) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Processing',
  tracking_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL
);
```

---

## 4. Backend API Structure

| HTTP Method | Endpoint | Auth Level | Purpose |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Create new customer account |
| **POST** | `/api/auth/login` | Public | Authenticate user & return JWT token |
| **GET** | `/api/auth/profile` | Customer / Admin | Retrieve authenticated profile |
| **GET** | `/api/auth/users` | Admin Only | View all registered customers & spend |
| **GET** | `/api/products` | Public | List products (with category, search, sort, price) |
| **GET** | `/api/products/:id` | Public | Get single product detail & client reviews |
| **POST** | `/api/products` | Admin Only | Create new catalogue product |
| **PUT** | `/api/products/:id` | Admin Only | Update price, inventory stock, details |
| **DELETE** | `/api/products/:id` | Admin Only | Retire product from boutique |
| **POST** | `/api/products/:id/reviews` | Customer / Admin | Post client rating and review |
| **GET** | `/api/categories` | Public | Retrieve active categories & item counts |
| **POST** | `/api/categories` | Admin Only | Create new category |
| **DELETE** | `/api/categories/:id` | Admin Only | Delete category |
| **POST** | `/api/orders` | Customer / Admin | Authorize & create new order |
| **GET** | `/api/orders/my` | Customer / Admin | List user's historical acquisitions |
| **GET** | `/api/orders/:id` | Customer (owner) / Admin | Get order details & live tracking stepper |
| **GET** | `/api/orders` | Admin Only | List all store customer orders |
| **PUT** | `/api/orders/:id/status`| Admin Only | Update status (Processing, Shipped, Delivered) |
| **POST** | `/api/coupons/validate`| Public | Check coupon code validity & calculate discount |
| **GET** | `/api/coupons` | Admin Only | List all store promotional vouchers |
| **POST** | `/api/coupons` | Admin Only | Create new discount coupon |
| **DELETE** | `/api/coupons/:id` | Admin Only | Delete discount coupon |
| **GET** | `/api/analytics` | Admin Only | Sales metrics, revenue history, order counts |

---

## 5. Directory & File Organization

```
ecommerce_store/
├── server/
│   ├── config/
│   │   └── db.js                 # Dual-mode persistence engine & seeding
│   ├── data/
│   │   └── store_data.json       # Persisted store state (products, users, orders)
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer verification & Admin authorization
│   │   └── errorMiddleware.js    # Global 404 & 500 error sanitization
│   ├── routes/
│   │   ├── analyticsRoutes.js    # Sales & revenue metrics
│   │   ├── authRoutes.js         # Register, Login, Profile, User list
│   │   ├── categoryRoutes.js     # Category management
│   │   ├── couponRoutes.js       # Coupon validation & management
│   │   ├── orderRoutes.js        # Checkout, fulfillment & status tracking
│   │   └── productRoutes.js      # Catalogue CRUD & reviews
│   ├── package.json              # Server dependencies & scripts
│   ├── server.js                 # Express server bootstrap & route mounting
│   └── .env                      # Environment secrets (JWT, PORT)
│
└── client/
    ├── index.html                # App shell with Google Fonts
    ├── vite.config.js            # Vite build & /api reverse proxy
    ├── tailwind.config.js        # Luxury typography & color tokens
    ├── postcss.config.js         # PostCSS pipeline
    ├── package.json              # Client dependencies & scripts
    └── src/
        ├── components/
        │   ├── Navbar.jsx        # Navigation, search, cart counter, user menu
        │   └── Footer.jsx        # Badges, atelier contacts, legal links
        ├── context/
        │   ├── AuthContext.jsx   # Auth state, login/register/logout methods
        │   └── CartContext.jsx   # Shopping bag, quantities, coupon calculation
        ├── pages/
        │   ├── AboutPage.jsx     # Maison heritage & values
        │   ├── AdminDashboard.jsx# Full admin control suite (6 integrated tabs)
        │   ├── CartPage.jsx      # Bag review, coupon code, order breakdown
        │   ├── CheckoutPage.jsx  # Delivery coordinates, Stripe/PayPal selector
        │   ├── ContactPage.jsx   # Concierge contact desk & message dispatch
        │   ├── HomePage.jsx      # Hero banner, category highlights, featured grid
        │   ├── LegalPages.jsx    # Privacy Policy & Terms of Acquisition
        │   ├── LoginPage.jsx     # Authentication + 1-Click demo logins
        │   ├── OrderHistoryPage.jsx # Past acquisitions archive
        │   ├── OrderSuccessPage.jsx # Live order tracking status stepper
        │   ├── ProductDetailPage.jsx# High-res gallery, specs, reviews form
        │   ├── RegisterPage.jsx  # New collector registration
        │   └── ShopPage.jsx      # Catalogue with search, filters, sorting
        ├── services/
        │   └── api.js            # Fetch wrapper with auto Bearer token injection
        ├── App.jsx               # Single Page Application router
        ├── index.css             # Tailwind base & custom scrollbar
        └── main.jsx              # React 18 DOM mount
```

---

## 6. AWS Production Deployment Guide

### Option 1: Elastic Container Service (ECS Fargate) + RDS PostgreSQL + S3/CloudFront

1. **Database Provisioning (Amazon RDS)**:
   - Create an Amazon RDS PostgreSQL (db.t4g.micro for dev or db.m6g.large for production).
   - Configure a dedicated VPC with private subnets and security group restricting inbound port 5432 to the ECS container tasks.
   - Run the PostgreSQL schema migration DDL provided in Section 3.B.

2. **Backend API Containerization (AWS ECS Fargate)**:
   - Build Docker container:
     ```dockerfile
     FROM node:20-alpine
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci --only=production
     COPY . .
     EXPOSE 5000
     CMD ["node", "server.js"]
     ```
   - Push to Amazon Elastic Container Registry (ECR).
   - Create an ECS Fargate Service behind an Application Load Balancer (ALB) with an AWS Certificate Manager (ACM) SSL certificate for HTTPS.
   - Store sensitive keys (`JWT_SECRET`, `DB_PASSWORD`, `STRIPE_SECRET_KEY`) in **AWS Secrets Manager** or **SSM Parameter Store**.

3. **Frontend Static Hosting (Amazon S3 + CloudFront)**:
   - Run `npm run build` inside `client/`.
   - Upload the `dist/` directory contents to an Amazon S3 bucket configured for website hosting:
     ```bash
     aws s3 sync dist/ s3://luxemaison-web-production/ --delete
     ```
   - Provision an Amazon CloudFront distribution pointing to the S3 origin.
   - In CloudFront, route `/api/*` requests to the Application Load Balancer DNS name, and `/*` to the S3 bucket with an Error Page rule routing `404` to `/index.html` (HTTP 200) to support SPA client routing.
   - Attach your custom domain via Amazon Route 53 with an Alias A-record.

4. **Product Image Storage (Amazon S3 + presigned URLs)**:
   - Store uploaded high-res product photos in an S3 bucket with strict bucket policy.
   - Serve optimized cached images globally via CloudFront CDN.
