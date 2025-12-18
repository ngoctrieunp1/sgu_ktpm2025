const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const productModel = require("../../models/productModels");
const userModel = require("../../models/UserModels");
const orderRoutes = require("../../Routers/OrderRoutes");

describe("Integration: Payment update order status (/updateorder)", () => {
  let app;
  let mongo;
  let userId;
  let product;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());

    const user = await userModel.create({
      name: "Pay User",
      email: "pay@example.com",
      password: "hashed",
      role: "user",
    });
    userId = user._id;

    product = await productModel.create({
      name: "Pay Burger",
      restaurantId: userId,
      price: 50000,
      category: "Fastfood",
      image: "burger.jpg",
      description: "test",
      postedBy: userId,
    });

    app = express();
    app.use(express.json());
    app.use(orderRoutes);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  async function createOrder() {
    const payload = {
      userId,
      products: [{ productId: product._id, quantity: 1 }],
      address: {
        name: "Test",
        phoneNumber: "0123456789",
        street: "123 Test",
        city: "HCM",
        pincode: "700000",
      },
    };

    const res = await request(app).post("/placeorder").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    // OrderModel default status = Payment pending
    expect(res.body).toHaveProperty("status", "Payment pending");
    return res.body;
  }

  test('IT-PAY-01: PATCH status="Payment completed" -> status đổi đúng', async () => {
    const order = await createOrder();

    const res = await request(app)
      .patch(`/updateorder/${order._id}`)
      .send({ status: "Payment completed" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", String(order._id));
    expect(res.body).toHaveProperty("status", "Payment completed");
  });

  test('IT-PAY-02: PATCH payment_status="Paid" -> map sang Payment completed', async () => {
    const order = await createOrder();

    const res = await request(app)
      .patch(`/updateorder/${order._id}`)
      .send({ payment_status: "Paid" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "Payment completed");
  });

  test("IT-PAY-03: PATCH body rỗng -> 400", async () => {
    const order = await createOrder();

    const res = await request(app).patch(`/updateorder/${order._id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "No valid fields to update" });
  });

  test("IT-PAY-04: PATCH orderId không tồn tại -> 404", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .patch(`/updateorder/${fakeId}`)
      .send({ status: "Payment completed" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Order not found" });
  });
});
