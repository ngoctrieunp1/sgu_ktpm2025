const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { health } = require('../../Controllers/health.controller');

describe('Integration: /health', () => {
  let app, mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    app = express();
    app.get('/health', health);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) await mongo.stop();
  });

  it('GET /health -> 200 {status:"ok"}', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
