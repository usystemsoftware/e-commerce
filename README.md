# ShopZone — Full Stack E-Commerce Website

A production-ready MERN stack e-commerce platform with complete User storefront and Admin control panel.

## 🛠 Tech Stack
- **Frontend**: React.js + Bootstrap 5 + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
```

### 3. Seed the Database
```bash
cd server
npm run seed
```
This creates:
- Admin: `admin@shop.com` / `admin123`
- User: `user@shop.com` / `user123`
- 6 categories & 12 sample products

### 4. Start the Backend
```bash
cd server
npm run dev
```
Runs on: http://localhost:5000

### 5. Start the Frontend
```bash
cd client
npm run dev
```
Runs on: http://localhost:5173

---

## 📦 Modules

### 🛍️ User Side
| Module | Route |
|--------|-------|
| Home | `/` |
| Product Listing | `/products` |
| Product Details | `/products/:id` |
| Cart | `/cart` |
| Wishlist | `/wishlist` |
| Login | `/login` |
| Register | `/register` |
| Checkout | `/checkout` |
| My Orders | `/orders` |
| Order Detail | `/orders/:id` |
| Profile | `/profile` |

### 🔧 Admin Side
| Module | Route |
|--------|-------|
| Admin Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Products | `/admin/products` |
| Add Product | `/admin/products/add` |
| Edit Product | `/admin/products/edit/:id` |
| Orders | `/admin/orders` |
| Users | `/admin/users` |
| Categories | `/admin/categories` |
| Stock | `/admin/stock` |

---

## 📁 Folder Structure
```
E-commerce-website/
├── client/         # React.js frontend (Vite)
└── server/         # Node.js + Express backend
```

## 🌐 API Base URL
`http://localhost:5000/api`
