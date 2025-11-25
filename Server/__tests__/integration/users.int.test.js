const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const UserRoutes = require('../../Routes/User.route');

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });

  app = express();
  app.use(express.json());
  app.use(UserRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Routes - Integration Test', () => {

  it('POST /register should create a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'user'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('POST /register duplicate email should return 400', async () => {
    await request(app).post('/register').send({
      name: 'A',
      email: 'dup@example.com',
      password: '111111',
      role: 'user'
    });

    const res = await request(app).post('/register').send({
      name: 'B',
      email: 'dup@example.com',
      password: '222222',
      role: 'user'
    });

    expect(res.status).toBe(400);
  });

  it('POST /login valid should return 200 & token', async () => {
    await request(app).post('/register').send({
      name: 'Login Test',
      email: 'login@example.com',
      password: 'abc123',
      role: 'user'
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'login@example.com', password: 'abc123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /login wrong password should return 400/401', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'login@example.com', password: 'wrong' });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

});
