// src/setupTests.js
import '@testing-library/jest-dom';

// ==== MOCK AXIOS ====
// App của bạn import "axios" trực tiếp (FoodItem.jsx gọi axios.get(...)),
// nên mock default module 'axios' với các phương thức trả về Promise.
jest.mock('axios', () => {
  const mock = {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({})),
    // nhiều code dùng axios.create(); trả về "this" để .get/.post hoạt động
    create: jest.fn(function () { return this; }),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  return mock;
});

// ==== MOCK jsPDF ====
// Tránh jsPDF đụng tới canvas trong môi trường test
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }));
});

// ==== POLYFILL CANVAS (phòng hờ nếu lib khác gọi canvas) ====
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(() => ({})),
  });
}

// ==== MOCK Context của app để render <App /> không lỗi ====
jest.mock('./Context/Context', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      user: null,
      setUser: jest.fn(),
      role: null,
      setRole: jest.fn(),
      authorized: false,
      setAuthorized: jest.fn(),
      addCart: jest.fn(),
      cart: [],
      setCart: jest.fn(),
    }),
  };
});
