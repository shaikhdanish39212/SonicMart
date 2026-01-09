# Comprehensive Sounds Accessories and Components - Backend

A robust e-commerce backend API built with Node.js, Express, and MongoDB for managing audio accessories and components.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes with middleware
- Password hashing with bcrypt
- Session management with cookies

### 📦 Product Management
- Complete CRUD operations for products
- Advanced filtering, sorting, and pagination
- Product categories, brands, and specifications
- Product reviews and ratings system
- Stock management with low-stock alerts
- Featured products support
- Image upload and gallery management

### 🛒 Shopping Cart
- User-specific cart management
- Add, update, remove cart items
- Cart persistence across sessions
- Coupon and discount system
- Stock validation

### 📋 Order Management
- Complete order lifecycle management
- Order status tracking
- Payment integration ready (Razorpay, Stripe, PayPal)
- Order history and analytics
- Admin order management

### 👤 User Management
- User registration and login
- Profile management
- Address management
- Wishlist functionality
- Order history
- Admin user management

### 🎯 Admin Dashboard
- Comprehensive dashboard with statistics
- User, product, and order analytics
- Sales reports and insights
- Admin-only routes and functionalities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

## Project Structure

```
backend/
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   └── upload.js       # File upload middleware
├── models/             # Database models
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   ├── Order.js        # Order model
│   ├── Cart.js         # Cart model
│   └── Coupon.js       # Coupon model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User routes
│   ├── products.js     # Product routes
│   ├── cart.js         # Cart routes
│   ├── orders.js       # Order routes
│   └── admin.js        # Admin routes
├── seeders/            # Database seeders
│   ├── seed.js         # Sample data seeder
│   └── importProducts.js # Product importer
├── uploads/            # File uploads directory
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
└── server.js          # Main server file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Update the `.env` file with your configurations:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sounds-accessories

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5174

# Payment Gateway Keys (Optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 3. Database Setup

#### Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

#### Seed Database with Sample Data
```bash
# Create sample users and products
npm run seed

# Import products from frontend JSON
npm run import

# Or run both commands
npm run seed-all
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /addresses` - Add address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address

### Product Routes (`/api/products`)
- `GET /` - Get all products (with filtering, sorting, pagination)
- `GET /:id` - Get single product
- `GET /featured/list` - Get featured products
- `GET /category/:category` - Get products by category
- `POST /:id/reviews` - Add product review
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)

### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /items` - Add item to cart
- `PUT /items/:productId` - Update cart item quantity
- `DELETE /items/:productId` - Remove item from cart
- `DELETE /` - Clear cart
- `POST /coupon` - Apply coupon
- `DELETE /coupon` - Remove coupon

### Order Routes (`/api/orders`)
- `POST /` - Create new order
- `GET /my-orders` - Get user's orders
- `GET /:id` - Get order by ID
- `PUT /:id/pay` - Update payment status
- `PUT /:id/cancel` - Cancel order
- `GET /` - Get all orders (Admin only)
- `PUT /:id/status` - Update order status (Admin only)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /wishlist/:productId` - Add to wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist
- `GET /wishlist` - Get user's wishlist
- `GET /orders` - Get user's orders
- `GET /stats` - Get user statistics
- `DELETE /account` - Delete user account

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Get dashboard statistics
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /analytics/products` - Get product analytics
- `GET /analytics/sales` - Get sales analytics

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, role)
- Addresses array
- Wishlist (product references)
- Account status and verification

### Product Model
- Basic info (name, description, price, category)
- Inventory (stock, SKU)
- Media (images, gallery)
- Specifications and features
- Reviews and ratings
- Analytics (views, sales count)

### Order Model
- User reference and order items
- Shipping address and payment info
- Order status and tracking
- Pricing breakdown
- Order history and notes

### Cart Model
- User-specific cart items
- Quantity and pricing
- Applied coupons
- Auto-calculated totals

### Coupon Model
- Discount codes and types
- Usage limits and restrictions
- Validity periods
- Usage tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Express validator for request validation
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication and authorization errors
- Database operation errors
- File upload errors
- Global error handling middleware

## Sample Login Credentials

After running the seeder (`npm run seed`):

**Admin Account:**
- Email: `admin@soundsaccessories.com`
- Password: `admin123456`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test manually
- **Frontend Application** - Connect your React frontend
- **curl** - Command line testing

Example API call:
```bash
# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soundsaccessories.com","password":"admin123456"}'
```

## Production Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up proper CORS origins
- Configure payment gateway credentials

### Performance Optimizations
- Database indexing (already implemented)
- Image compression and CDN
- API response caching
- Rate limiting
- Database connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the API documentation
- Review error messages in the response
- Ensure all environment variables are properly set
- Verify MongoDB connection
