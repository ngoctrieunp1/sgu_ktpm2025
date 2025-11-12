const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productModel = require('../../models/productModels');
const userModel = require('../../models/UserModels');

const cartRoutes = require('../../Routers/CartRoutes');   // /addCart, /cart/:userId, /item/:itemId
const orderRoutes = require('../../Routers/OrderRoutes'); // /placeorder,...

describe('Integration: Cart & Orders', () => {
  let app;
  let mongo, userId, product;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const user = await userModel.create({
      name: 'User X',
      email: 'x@example.com',
      password: 'hashed',
      role: 'user'
    });
    userId = user._id;

    product = await productModel.create({
      name: 'Com Tam',
      restaurantId: userId, // chỉ cần ObjectId hợp lệ theo schema
      price: 45000,
      category: 'Vietnamese',
      image: 'comtam.jpg',
      description: 'Cơm tấm sườn bì chả',
      postedBy: userId
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

  it('POST /addCart rồi GET /cart/:userId -> thấy item đã thêm', async () => {
    const addRes = await request(app)
      .post('/addCart')
      .send({ itemId: product._id, userId, quantity: 2 });
    expect(addRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/cart/${userId}`);
    expect(getRes.statusCode).toBe(200);
    const items = Array.isArray(getRes.body) ? getRes.body : getRes.body?.items;
    expect(Array.isArray(items)).toBe(true);
    const ids = items.map(it => (it.itemId?._id || it.itemId).toString());
    expect(ids).toEqual(expect.arrayContaining([product._id.toString()]));
  });

  it('GET /item/:itemId -> trả về chi tiết product', async () => {
    const res = await request(app).get(`/item/${product._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', product._id.toString());
  });

  it('POST /placeorder (payload thiếu) -> 400', async () => {
    const res = await request(app).post('/placeorder').send({});
    expect(res.statusCode).toBe(400);
  });
});
