const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

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

  user = await User.create({
    name: 'Cart User',
    email: 'cart@example.com',
    password: '123456',
    role: 'user'
  });

  product = await Product.create({
    name: 'Pizza',
    price: 10,
    restaurantId: user._id,
    postedBy: user._id
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Cart Additional Actions - Integration Test', () => {

  let itemId;

  it('POST /addCart should add item to cart', async () => {
    const res = await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId: user._id, quantity: 2 });

    expect(res.status).toBe(200);
    itemId = res.body._id;
  });

  it('POST /cart/update/:itemId should update quantity', async () => {
    const res = await request(app)
      .post(`/cart/update/${itemId}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
  });

  it('POST /cart/decrement/:itemId should decrement quantity', async () => {
    const res = await request(app)
      .post(`/cart/decrement/${itemId}`);

    expect(res.status).toBe(200);
  });

  it('POST /remove/:itemId should remove item', async () => {
    const res = await request(app)
      .post(`/remove/${itemId}`);

    expect(res.status).toBe(200);

    const cartCheck = await request(app).get(`/cart/${user._id}`);
    expect(cartCheck.body.length).toBe(0);
  });

});
