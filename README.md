# 🎧 SonicMart - Sound Accessories & Components


> **The Ultimate Marketplace for Audiophiles & Builders.** A specialized e-commerce platform for high-quality sound accessories and internal audio components.

## 🚀 Live Demo
- **Frontend:** [https://sonic-mart.vercel.app](https://sonic-mart.vercel.app)
- **Backend API:** [https://sonicmart.onrender.com](https://sonicmart.onrender.com)

---

## 📖 Overview
SonicMart is a specialized **MERN Stack** e-commerce application designed for the audio community. Unlike generic stores, SonicMart caters to both listeners and creators, offering everything from premium headphones to **internal components** (PCBs, Drivers, Capacitors) for DIY audio projects.

## ✨ Key Features
- **🔧 Specialized Inventory**
  - **Ready-to-Use:** Headphones, Cables, DACs, and Stands.
  - **Internal Components:** Dedicated section for Speaker Drivers, Crossover Networks, and Amplifier Modules.
  - **Dynamic Filtering:** Filter by component specs, power rating, and compatibility.

- **🛍️ User Experience**
  - Modern, responsive design with Glassmorphism UI
  - Advanced Search for specific part numbers
  - Cart & Wishlist with bulk order capability
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
