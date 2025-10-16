// jest-dom adds custom jest matchers for asserting on DOM nodes.
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * 1) Mock axios
 * - Nếu bạn CÓ file `src/__mocks__/axios.js` thì đổi dòng dưới thành:  jest.mock('axios');
 * - Nếu bạn KHÔNG có file manual mock, giữ nguyên factory dưới đây.
 */
jest.mock('axios', () => {
  const instance = {
    get:    jest.fn(() => Promise.resolve({ data: [] })),
    post:   jest.fn(() => Promise.resolve({ data: {} })),
    put:    jest.fn(() => Promise.resolve({ data: {} })),
    patch:  jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response:{ use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  };
  return {
    create: () => instance,   // axios.create() -> instance giả
    get: instance.get,
    post: instance.post,
    put: instance.put,
    patch: instance.patch,
    delete: instance.delete,
    interceptors: instance.interceptors,
    defaults: instance.defaults,
    __instance: instance,
  };
});

/**
 * 2) Nếu dự án có `src/axios.js` (export const api = axios.create(...)),
 *    mock luôn module này để mọi import { api } nhận instance axios giả ở trên.
 *    Không có file đó cũng không sao.
 */
jest.mock('./axios', () => {
  const axios = require('axios'); // lấy mock ở trên
  return { api: axios.create() };
});

/**
 * 3) Mock jsPDF + polyfill canvas.getContext để tránh crash trong jsdom
 */
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }));
});

// jsdom không có canvas.getContext
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}

/**
 * 4) Mock Context mặc định để tránh lỗi setUser / setAuthorized is not a function
 *    (Nếu app không dùng Context này thì cũng vô hại.)
 */
jest.mock('./Context/Context', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      user: null,
      setUser: jest.fn(),
      authorized: false,
      setAuthorized: jest.fn(),
      // có thể thêm các field khác nếu component dùng: cart, setCart, etc.
    }),
  };
});
