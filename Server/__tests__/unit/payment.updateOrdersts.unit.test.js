const httpMocks = require("node-mocks-http");

// Mock OrderModel trước khi require Controller
jest.mock("../../models/OrderModel", () => ({
  findByIdAndUpdate: jest.fn(),
}));

const orderCollection = require("../../models/OrderModel");
const { updateOrdersts } = require("../../Controllers/OrderController");

describe("Unit: OrderController.updateOrdersts (payment status)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("UT-PAY-01: 400 nếu body không có status/payment_status", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: {},
    });
    const res = httpMocks.createResponse();

    await updateOrdersts(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "No valid fields to update" });
    expect(orderCollection.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("UT-PAY-02: 400 nếu status là chuỗi rỗng", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { status: "" },
    });
    const res = httpMocks.createResponse();

    await updateOrdersts(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "No valid fields to update" });
    expect(orderCollection.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test('UT-PAY-03: update theo status="Payment completed"', async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { status: "Payment completed" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockResolvedValue({
      _id: "order123",
      status: "Payment completed",
    });

    await updateOrdersts(req, res);

    expect(orderCollection.findByIdAndUpdate).toHaveBeenCalledWith(
      "order123",
      { status: "Payment completed" },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("status", "Payment completed");
  });

  test('UT-PAY-04: update theo status="Payment pending"', async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { status: "Payment pending" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockResolvedValue({
      _id: "order123",
      status: "Payment pending",
    });

    await updateOrdersts(req, res);

    expect(orderCollection.findByIdAndUpdate).toHaveBeenCalledWith(
      "order123",
      { status: "Payment pending" },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("status", "Payment pending");
  });

  test('UT-PAY-05: map payment_status="Paid" -> "Payment completed"', async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { payment_status: "Paid" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockResolvedValue({
      _id: "order123",
      status: "Payment completed",
    });

    await updateOrdersts(req, res);

    expect(orderCollection.findByIdAndUpdate).toHaveBeenCalledWith(
      "order123",
      { status: "Payment completed" },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("status", "Payment completed");
  });

  test('UT-PAY-06: map payment_status="Payment pending" -> "Payment pending"', async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { payment_status: "Payment pending" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockResolvedValue({
      _id: "order123",
      status: "Payment pending",
    });

    await updateOrdersts(req, res);

    expect(orderCollection.findByIdAndUpdate).toHaveBeenCalledWith(
      "order123",
      { status: "Payment pending" },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("status", "Payment pending");
  });

  test("UT-PAY-07: 404 nếu order không tồn tại", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order_not_found" },
      body: { status: "Payment completed" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockResolvedValue(null);

    await updateOrdersts(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Order not found" });
  });

  test("UT-PAY-08: 500 nếu DB throw error", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { orderId: "order123" },
      body: { status: "Payment completed" },
    });
    const res = httpMocks.createResponse();

    orderCollection.findByIdAndUpdate.mockRejectedValue(new Error("DB down"));

    await updateOrdersts(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: "Failed to update order status" });
  });
});
