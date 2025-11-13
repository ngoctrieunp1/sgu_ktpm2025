const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productModel = require('../../models/productModels');
const userModel = require('../../models/UserModels');

const productRoutes = require('../../Routers/Routes'); // /view, /product/:id, /searchproduct, /productcount
// Chỉ test các endpoint public (không cần Auth)

describe('Integration: Products public endpoints', () => {
  let app;
  let mongo, userId, productA, productB;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    // Seed 1 nhà hàng (bắt buộc vì schema product yêu cầu restaurantId & postedBy)
    const user = await userModel.create({
      name: 'Resto A',
      email: 'a@example.com',
      password: 'hashed',
      role: 'Restaurant'
    });
    userId = user._id;

    // Seed 2 món
    productA = await productModel.create({
      name: 'Pho Bo',
      restaurantId: userId,
      price: 50000,
      category: 'Vietnamese',
      image: 'pho.jpg',
      description: 'Phở bò ngon',
      postedBy: userId
    });

    productB = await productModel.create({
      name: 'Banh Mi',
      restaurantId: userId,
      price: 25000,
      category: 'Vietnamese',
      image: 'banhmi.jpg',
      description: 'Bánh mì đặc biệt',
      postedBy: userId
    });

    app = express();
    app.use(express.json());
    app.use(productRoutes); // mount đúng path gốc trong router
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('GET /view -> 200 array of products', async () => {
    const res = await request(app).get('/view');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const names = res.body.map(p => p.name);
    expect(names).toEqual(expect.arrayContaining(['Pho Bo', 'Banh Mi']));
  });

  it('GET /product/:id -> 200 product details', async () => {
    const res = await request(app).get(`/product/${productA._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', productA._id.toString());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// cái này là test đúng
    // expect(res.body).toHaveProperty('name', 'Pho Bo');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// cái này là test sai
    expect(res.body).toHaveProperty('name', 'Pho Ga');
// Lý do: API thật trả về "Pho Bo", nhưng test lại đòi "Pho Ga" → Jest sẽ báo fail test này.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  });

  it('GET /searchproduct?search=banh -> 200 matched list', async () => {
    const res = await request(app).get('/searchproduct').query({ search: 'banh' });
    expect(res.statusCode).toBe(200);
    const names = res.body.map(p => p.name);
    expect(names).toEqual(expect.arrayContaining(['Banh Mi']));
  });

  it('GET /productcount -> 200 {count: N}', async () => {
    const res = await request(app).get('/productcount');
    expect(res.statusCode).toBe(200);
    // Chấp nhận nhiều format phổ biến: {count} | {total} | {products}
    const count = res.body.count ?? res.body.total ?? res.body.products ?? null;
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
// test trigger