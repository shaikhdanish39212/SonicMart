# 🎧 SonicMart - Premium Audio E-Commerce Platform

![SonicMart Banner](https://via.placeholder.com/1200x400/1a1a1a/ffffff?text=SonicMart+Premium+Audio)

> **Experience Sound Like Never Before.** A fully functional, full-stack e-commerce solution for high-end audio accessories.

## 🚀 Live Demo
- **Frontend:** [https://sonic-mart.vercel.app](https://sonic-mart.vercel.app)
- **Backend API:** [https://sonicmart.onrender.com](https://sonicmart.onrender.com)

---

## 📖 Overview
SonicMart is a robust **MERN Stack** (MongoDB, Express, React, Node.js) e-commerce application designed for selling premium audio equipment. It features a modern, responsive UI, secure payment integration, admin dashboard, and real-time inventory management.

## ✨ Key Features
- **🛍️ User Experience**
  - Modern, responsive design with Glassmorphism UI
  - Advanced Product Filtering & Search
  - Cart & Wishlist Management with persistent state
  - User Authentication (JWT) & Profile Management

- **💳 Payments & Orders**
  - **Razorpay Integration** for secure payments
  - Order Tracking & History
  - PDF Invoice Generation

- **⚡ Admin Dashboard**
  - Visual Analytics & Sales Reports
  - Product, Category, and Deal Management
  - Order Status Workflow (Processing -> Shipped -> Delivered)
  - Coupon & Discount Management

## 🛠️ Tech Stack
### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Redux / Context API** (State Management)
- **Framer Motion** (Animations)

### Backend
- **Node.js & Express.js** (REST API)
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM)
- **Razorpay** (Payment Gateway)

---

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaikhdanish39212/SonicMart.git
   cd SonicMart
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your credentials (MONGODB_URI, JWT_SECRET, RAZORPAY_KEYS)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../myproject
   npm install
   # Create a .env file (VITE_API_URL, VITE_RAZORPAY_KEY_ID)
   npm run dev
   ```

## 🔐 Environment Variables
### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`myproject/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ by Danish Shaikh*
