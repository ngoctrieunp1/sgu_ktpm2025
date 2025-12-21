import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 50,           // tải nhẹ đúng testcase
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"], // 95% request < 2s
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

function randEmail() {
  return `perf_${Date.now()}_${Math.floor(Math.random() * 1e9)}@test.com`;
}

export function setup() {
  // 1) Register 1 user dùng chung cho test
  const regPayload = JSON.stringify({
    name: "Perf User",
    email: randEmail(),
    password: "123456",
    role: "User",
  });

  const regRes = http.post(`${BASE_URL}/register`, regPayload, {
    headers: { "Content-Type": "application/json" },
  });

  check(regRes, { "register ok": (r) => r.status === 200 });
  const regJson = regRes.json();
  const userId = regJson?.user?._id;

  // 2) Lấy 1 product bất kỳ để đặt hàng
  const prodRes = http.get(`${BASE_URL}/view`);
  check(prodRes, { "view products ok": (r) => r.status === 200 });

  const products = prodRes.json();
  const first = Array.isArray(products) ? products[0] : null;
  const productId = first?._id;

  return { userId, productId };
}

export default function (data) {
  const { userId, productId } = data;

  const payload = JSON.stringify({
    userId,
    address: {
      name: "Perf User",
      phoneNumber: "0900000000",
      street: "1 Test Street",
      city: "HCMC",
      pincode: "700000",
    },
    products: [{ productId, quantity: 1 }],
  });

  const res = http.post(`${BASE_URL}/placeorder`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "placeorder status 201": (r) => r.status === 201,
    "PER_CHK02: response < 2000ms": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
