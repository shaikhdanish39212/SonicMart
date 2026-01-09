const request = require('supertest');
const app = require('../server');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Products Routes', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let normalUser;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'admin'
    });

    // Create normal user
    normalUser = await User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'user'
    });

    // Generate tokens
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET);
    userToken = jwt.sign({ userId: normalUser._id }, process.env.JWT_SECRET);

    // Create test products
    await Product.create([
      {
        name: 'Test Product 1',
        description: 'Test description 1',
        price: 99.99,
        originalPrice: 149.99,
        category: 'Electronics',
        subcategory: 'Speakers',
        brand: 'Test Brand',
        images: ['test1.jpg'],
        stock: 10,
        specifications: { 'Power': '100W' }
      },
      {
        name: 'Test Product 2',
        description: 'Test description 2',
        price: 199.99,
        category: 'Electronics',
        subcategory: 'Headphones',
        brand: 'Test Brand 2',
        images: ['test2.jpg'],
        stock: 5,
        specifications: { 'Frequency': '20Hz-20kHz' }
      }
    ]);
  });

  describe('GET /api/products', () => {
    test('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.products[0].name).toBe('Test Product 1');
    });

    test('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
    });

    test('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=Product 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toBe('Test Product 1');
    });

    test('should sort products by price', async () => {
      const response = await request(app)
        .get('/api/products?sort=price')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products[0].price).toBeLessThan(response.body.data.products[1].price);
    });

    test('should paginate products', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should get single product by ID', async () => {
      const products = await Product.find();
      const productId = products[0]._id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(productId.toString());
      expect(response.body.data.name).toBe('Test Product 1');
    });

    test('should return 404 for non-existent product', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/products/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    test('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('POST /api/products', () => {
    test('should create product with admin token', async () => {
      const productData = {
        name: 'New Test Product',
        description: 'New test description',
        price: 299.99,
        category: 'Electronics',
        subcategory: 'Amplifiers',
        brand: 'New Brand',
        images: ['new-test.jpg'],
        stock: 15,
        specifications: { 'Power': '200W' }
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.price).toBe(productData.price);

      // Verify product was saved to database
      const savedProduct = await Product.findOne({ name: productData.name });
      expect(savedProduct).toBeTruthy();
    });

    test('should not create product with user token', async () => {
      const productData = {
        name: 'New Test Product',
        description: 'New test description',
        price: 299.99,
        category: 'Electronics',
        brand: 'New Brand'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should not create product without authentication', async () => {
      const productData = {
        name: 'New Test Product',
        description: 'New test description',
        price: 299.99
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should validate required fields', async () => {
      const incompleteProduct = {
        name: 'Incomplete Product'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });
});