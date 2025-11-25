const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productModel = require('../../models/productModels');
const userModel = require('../../models/UserModels');
const cartRoutes = require('../../Routers/CartRoutes');

describe('Integration: Cart extra actions', () => {
  let app;
  let mongo, userId, product;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const user = await userModel.create({
      name: 'Cart User',
      email: 'cart@example.com',
      password: 'hashed',
      role: 'user',
    });
    userId = user._id;

    product = await productModel.create({
      name: 'Pizza',
      restaurantId: userId,
      price: 100000,
      category: 'Fastfood',
      image: 'pizza.jpg',
      description: 'Pizza test',
      postedBy: userId,
    });

    app = express();
    app.use(express.json());
    app.use(cartRoutes);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('POST /cart/update/:itemId should update quantity', async () => {
    // đảm bảo cart có item trước
    await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId, quantity: 1 });

    const res = await request(app)
      .post(`/cart/update/${product._id}`)
      .send({ userId, quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Cart updated successfully');
  });

  it('POST /cart/decrement/:itemId should decrement quantity', async () => {
    await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId, quantity: 5 });

    const res = await request(app)
      .post(`/cart/decrement/${product._id}`)
      .send({ userId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /remove/:itemId should remove item from cart', async () => {
    await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId, quantity: 2 });

    const res = await request(app)
      .post(`/remove/${product._id}`)
      .send({ userId });

    expect(res.status).toBe(200);

    const cartRes = await request(app).get(`/cart/${userId}`);
    expect(Array.isArray(cartRes.body)).toBe(true);
    expect(cartRes.body.length).toBe(0);
  });
});
