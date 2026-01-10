# 🎧 SonicMart - Sound Accessories & Internal Components

![SonicMart Banner](https://via.placeholder.com/1200x400/0f172a/38bdf8?text=SonicMart+High-Fidelity+Experience)

> **The Ultimate Marketplace for Audiophiles & Builders.**  
> SonicMart is a specialized, full-stack e-commerce platform bridging the gap between high-end audio accessories and professional-grade internal components. Whether you are a listener upgrading your setup or a builder creating a custom crossover, SonicMart covers the entire spectrum.

## 🚀 Live Demonstration
- **Frontend (Vercel):** [https://sonic-mart.vercel.app](https://sonic-mart.vercel.app)
- **Backend API (Render):** [https://sonicmart.onrender.com](https://sonicmart.onrender.com)

---

## 🌟 Why SonicMart?
Unlike generic e-commerce stores, SonicMart is built with specific features for the audio community:

### 🔧 For The Builder (Internal Components)
- **Specialized Catalog:** Dedicated sections for **Speaker Drivers**, **Crossover Networks**, **Capacitors**, and **PCBs**.
- **Technical Specs:** Detailed product attributes (Impedance, Power Handling, Dimensions) for compatibility checks.
- **Bulk Ordering:** Optimization for project-based purchasing.

### 🎧 For The Listener (Accessories)
- **Premium Gear:** Curated selection of Headphones, DACs, Studio Monitors, and Cables.
- **Product Comparison:** Compare up to 4 items side-by-side to make informed decisions.
- **Wishlist & Deals:** Track favorite items and get notified of price drops.

---

## ✨ Integrated Features

### 🛒 Advanced Commerce
- **Real-Time Inventory:** Automatic stock deduction and "Low Stock" alerts.
- **Secure Payments:** Seamless integration with **Razorpay** for credit cards, UPI, and wallets.
- **Order Tracking:** Detailed timeline of order status from *Processing* to *Delivered*.
- **Returns System:** Automated RMA requests and return status tracking context.

### ⚡ Performance & UX
- **Glassmorphism UI:** Modern, translucent aesthetics using **Tailwind CSS**.
- **Fast Loading:** Built on **Vite** with lazy-loaded images for optimal performance.
- **PDF Invoicing:** Server-side PDF generation for every order using `pdfkit`.

### 🛡️ Admin Dashboard
- **Visual Analytics:** Sales charts, revenue reports, and user growth stats.
- **Coupon Manager:** Create percentage or fixed-value discounts with expiry tracking.
- **Product Management:** CSV Import/Export, Image Uploads (Multer), and Rich Text descriptions.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Core:** React.js 18 (Vite), React Router DOM 7
- **Styling:** Tailwind CSS, DaisyUI, Framer Motion (Animations)
- **State Management:** Context API + Custom Hooks
- **Utilities:** React Hot Toast, Lucide Icons, React Lazy Load

### Backend (Server)
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Security:** JWT (Auth), Bcrypt (Hashing), Helmet (Headers), Express Rate Limit
- **Integrations:** Razorpay (Payments), Nodemailer (Email Alerts), Multer (File Uploads), PDFKit (Invoicing)

---

## 📂 Project Structure

```bash
SonicMart/
├── myproject/                # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/       # Reusable UI (ProductCard, Navbar, etc.)
│   │   ├── pages/            # Route Pages (Home, Checkout, Admin)
│   │   │   ├── admin/        # Protected Admin Dashboard routes
│   │   │   └── ...
│   │   ├── context/          # Global State (Cart, Auth, Theme)
│   │   └── utils/            # API wrappers & Helpers
│   └── ...
├── backend/                  # Backend (Node + Express)
│   ├── controllers/          # Business Logic
│   ├── models/               # Mongoose Schemas (Product, Order, Deal)
│   ├── routes/               # API Endpoints
│   ├── seeders/              # Scripts to populate initial data
│   └── ...
└── README.md                 # Project Documentation
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Razorpay Test Account

### 1. Clone & Install
```bash
git clone https://github.com/shaikhdanish39212/SonicMart.git
cd SonicMart
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../myproject
npm install
```
Create a `.env` file in the `myproject/` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
Start the client:
```bash
npm run dev
```

---

## 🤝 Contributing
We welcome contributions from the audio community!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Attribute to **Danish Shaikh**.

---
*Crafted with 🎧 and ❤️ for the Audio Community.*
