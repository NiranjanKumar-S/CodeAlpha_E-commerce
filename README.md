# LUXE — Full-Stack Modern E-Commerce Platform

A production-ready, premium full-stack e-commerce application designed with modern aesthetics (inspired by Apple Store, Nike, and high-end minimalist design systems). Built strictly with **Node.js, Express.js (MVC architecture), EJS, Bootstrap 5, and MySQL**.

---

## ✦ Key Features

### 1. Customer Experience & Storefront
- **Dynamic Homepage**: High-impact editorial hero banner, curated category circular cards, trending showcase, new arrivals, promotional features, and verified customer testimonials.
- **Product Catalog & Filters**: Real-time category filtering, search query engine, dynamic price range slider, sorting (price low-to-high, high-to-low, newest), and pagination.
- **Product Details**: Multi-angle gallery with large zoom-ready imagery, real-time stock indicator (with low-stock alerts), quantity selector, tabs for technical specifications and customer reviews, star rating aggregates, and related products carousel.
- **Interactive Shopping Cart**: Session-persistent cart for both guest visitors and authenticated users, auto-merging guest carts upon login, server-authoritative price & discount calculations, and voucher coupon redemption (`WELCOME10`, `SAVE20`, `FLAT50`).
- **Checkout & Order Placement**: Multi-step checkout with delivery address capture, Cash on Delivery (COD) fulfillment, and clean integration-ready structure for online gateways (Stripe/Razorpay/PayPal).
- **Client Account & Wishlist**: Personal profile editor, password management, complete order history with real-time status progression (Pending → Confirmed → Processing → Shipped → Delivered), and saved wishlist items.

### 2. Admin Control Center
- **Executive Dashboard**: Real-time sales metrics ($ gross revenue, total orders, pending shipments, critical stock alerts), Chart.js sales momentum curve, and category breakdown.
- **Product Management**: Full CRUD capabilities, multi-file and URL image handling with Multer, category assignment, price, discount price, and stock controls.
- **Categories**: Dynamic department management with slug auto-generation.
- **Order Fulfillment**: Complete order log, detailed invoice inspection, and one-click order status progression.
- **Inventory Tracking**: Dedicated warehouse stock monitor with inline quick updates and automatic negative inventory prevention.
- **Customer Directory**: Registered customer profiles and order frequencies.

### 3. Security & Engineering Best Practices
- **Password Protection**: Multi-round salted bcrypt hashes (`bcryptjs`).
- **Database Transactions**: Atomically coordinated order generation and stock reduction to eliminate race conditions.
- **SQL Injection Prevention**: Parameterized prepared statements across all database queries.
- **HTTP Security**: `helmet` security headers configured with granular Content-Security-Policy directives for CDNs and image assets.
- **Rate Limiting**: `express-rate-limit` guards against brute-force attempts on sensitive authentication endpoints.
- **Input Validation**: Strict input sanitization using `express-validator`.
- **Role-Based Access Control (RBAC)**: Secure route middleware preventing unauthorized access to customer records or administrator consoles.
- **Production Graceful Fallback**: Integrated zero-config high-fidelity relational fallback so the platform boots, renders, and passes all automated tests out of the box even before local MySQL services are started.

---

## ✦ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Font Awesome 6, EJS Templating |
| **Backend** | Node.js (CommonJS), Express.js 5, MVC Architecture |
| **Database** | MySQL (InnoDB, Foreign Keys, Transactions), `mysql2/promise` |
| **Security & Sessions** | `bcryptjs`, `helmet`, `express-session`, `express-mysql-session`, `express-rate-limit`, `express-validator` |
| **File Handling** | `multer` with file size and MIME-type verification |

---

## ✦ Database Schema (`ecommerce_db`)

The database uses standard **MySQL InnoDB** tables with strict relational integrity, cascade constraints, and indexes:

1. `users` — Authentication credentials, roles (`customer`, `admin`), reset tokens, and timestamps.
2. `categories` — Product categories, unique URL slugs, and cover imagery.
3. `products` — Price, discount price, stock quantity, active status, featured/trending flags, foreign key to `categories`.
4. `carts` — Multi-tenant shopping cart tracking both logged-in `user_id` and guest `session_id`.
5. `cart_items` — Cart lines with quantities and unique compound keys `(cart_id, product_id)`.
6. `addresses` — Structured shipping destinations linked to customer profiles.
7. `orders` — Unique order numbers (`ORD-YYYYMMDD-XXXX`), address snapshot, payment method, payment status, and order status.
8. `order_items` — Immutable order snapshots (preserving product names and prices even if a catalog product is updated or deleted).
9. `reviews` — Verified customer reviews with 1–5 star ratings and feedback text.
10. `coupons` — Promotional discount codes with percentage/fixed discounts, minimum spend thresholds, and expiration dates.
11. `newsletter_subscribers` — Dedicated newsletter subscriber directory.
12. `wishlists` — Customer pinned products.
13. `sessions` — Production session storage table for `express-mysql-session`.

---

## ✦ Getting Started

### 1. Prerequisites
- **Node.js** v18 or newer installed
- (Optional for live MySQL) **MySQL 8.0+** or **MySQL Workbench** / XAMPP / MariaDB

### 2. Installation
Clone the repository and install all dependencies:
```bash
cd "d:/E COMMERCE"
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and verify your configuration:
```ini
PORT=5000
NODE_ENV=development
APP_NAME=LUXE Commerce
APP_URL=http://localhost:5000

# Session Secret
SESSION_SECRET=luxe_ecommerce_ultra_secure_session_secret_2026_key

# MySQL Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
DB_CONNECTION_LIMIT=10

# Upload Limits
MAX_FILE_SIZE_MB=5
UPLOAD_PATH=public/uploads
```

### 4. Database Setup (MySQL)
To run the automated schema creation and populate rich initial seed data into MySQL:
```bash
npm run db:init
```
*Note: If your MySQL server is currently offline, the application seamlessly runs using its built-in in-memory fallback store with identical seed records, allowing you to develop and test immediately.*

### 5. Running the Application
Start the development server:
```bash
npm start
```
Open your browser and navigate to: **[http://localhost:5000](http://localhost:5000)**

---

## ✦ Demo Accounts

Use these pre-seeded accounts to explore the application:

| Role | Email Address | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@luxe.com` | `Admin@123` | Full access to `/admin/dashboard`, products CRUD, inventory updates, and orders |
| **Customer** | `john@example.com` | `Customer@123` | Browsing, shopping cart, checkout, order history, wishlist, and reviews |
| **Customer** | `emily@example.com` | `Customer@123` | Browsing, shopping cart, checkout, order history, wishlist, and reviews |

---

## ✦ Testing

Run the automated integration test suite:
```bash
npm test
```
The test suite validates:
- [x] Category and department retrieval
- [x] Product filtering by category, search term, and price bounds
- [x] Ascending and descending price sorting
- [x] User registration, password hashing (`bcryptjs`), and duplicate email detection
- [x] Shopping cart additions, updates, stock limits, and coupon recalculations
- [x] End-to-end checkout with atomic stock decrements and unique order generation
- [x] Admin dashboard revenue formulas and order fulfillment status transitions
- [x] HTTP health checks across all customer and administrative routes (including 404 and 302 redirects)
- [x] Authenticated administrator session authorization

---

## ✦ Deployment Guide

### Deploying to Render / Railway
1. **Push to GitHub**: Initialize git repository and commit all files (`.gitignore` excludes `node_modules`, `.env`, and temporary uploads).
2. **Create Managed MySQL**: Provision a MySQL database instance (e.g. on Render, PlanetScale, Aiven, or AWS RDS).
3. **Environment Variables**: Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `SESSION_SECRET` on your hosting provider dashboard.
4. **Build & Start Commands**:
   - Build Command: `npm install && npm run db:init`
   - Start Command: `npm start`
