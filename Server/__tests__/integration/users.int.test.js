const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

const UserRoutes = require('../../Routers/UserRoutes');

let app, mongoServer;

// set key dùng cho jwt trong môi trường test
beforeAll(async () => {
  process.env.JWT_KEY = 'test_secret_key';

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });

  app = express();
  app.use(express.json());
  app.use(UserRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Integration: User register & login', () => {
  it('POST /register should create a new user and return token + user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'user',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('POST /register with duplicate email should return 400', async () => {
    await request(app).post('/register').send({
      name: 'Dup',
      email: 'dup@example.com',
      password: '111111',
      role: 'user',
    });

    const res = await request(app).post('/register').send({
      name: 'Dup2',
      email: 'dup@example.com',
      password: '222222',
      role: 'user',
    });

    expect(res.status).toBe(400);
  });

  it('POST /login with correct credentials should return 200 & token', async () => {
    await request(app).post('/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'abc123',
      role: 'user',
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'login@example.com', password: 'abc123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /login with wrong password should return 4xx', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'login@example.com', password: 'wrongpass' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});
