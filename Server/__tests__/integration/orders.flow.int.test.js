const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

const OrderRoutes = require('../../Routes/Order.route');
const CartRoutes = require('../../Routes/Cart.route');

const Product = require('../../Models/Product.model');
const User = require('../../Models/User.model');

let app, mongoServer, user, product;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });

  app = express();
  app.use(express.json());
  app.use(CartRoutes);
  app.use(OrderRoutes);

  user = await User.create({
    name: 'Order User',
    email: 'order@example.com',
    password: '123456',
    role: 'user'
  });

  product = await Product.create({
    name: 'Burger',
    price: 12,
    restaurantId: user._id,
    postedBy: user._id
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Order Flow - Integration Test', () => {

  it('Add to cart first', async () => {
    const res = await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId: user._id, quantity: 2 });

    expect(res.status).toBe(200);
  });

  it('POST /placeorder should create an order', async () => {
    const res = await request(app)
      .post('/placeorder')
      .send({ userId: user._id });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('orders');
  });

  it('GET /Allorders should return list of orders', async () => {
    const res = await request(app).get('/Allorders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /getOrdersByUser/:id should return orders of that user', async () => {
    const res = await request(app).get(`/getOrdersByUser/${user._id}`);
    expect(res.status).toBe(200);
  });

});
