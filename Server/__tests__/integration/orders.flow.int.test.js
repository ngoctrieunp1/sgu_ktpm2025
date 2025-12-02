const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productModel = require('../../models/productModels');
const userModel = require('../../models/UserModels');

const cartRoutes = require('../../Routers/CartRoutes');
const orderRoutes = require('../../Routers/OrderRoutes');

describe('Integration: Order flow', () => {
  let app;
  let mongo, userId, product;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const user = await userModel.create({
      name: 'Order User',
      email: 'order@example.com',
      password: 'hashed',
      role: 'user',
    });
    userId = user._id;

    product = await productModel.create({
      name: 'Burger',
      restaurantId: userId,
      price: 50000,
      category: 'Fastfood',
      image: 'burger.jpg',
      description: 'Burger test',
      postedBy: userId,
    });

    app = express();
    app.use(express.json());
    app.use(cartRoutes);
    app.use(orderRoutes);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('POST /placeorder should create an order', async () => {
    const payload = {
      userId,
      products: [
        {
          productId: product._id,
          quantity: 2,
        },
      ],
      address: {
        name: 'Test',
        phoneNumber: '0123456789',
        street: '123 Test',
        city: 'HCM',
        pincode: '700000',
      },
    };

    const res = await request(app).post('/placeorder').send(payload);

    expect(res.status).toBe(201); // placeOrder dùng 201
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('products');
  });

  it('GET /Allorders should return array of orders', async () => {
    const res = await request(app).get('/Allorders');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /getOrdersByUser/:userId should return user orders', async () => {
    const res = await request(app).get(`/getOrdersByUser/${userId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
