// jest-dom adds custom jest matchers for asserting on DOM nodes.
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * 1) Mock axios để mọi lời gọi HTTP trong test đều là giả (Promise).
 */
jest.mock('axios', () => {
  const instance = {
    get:    jest.fn(() => Promise.resolve({ data: [] })),
    post:   jest.fn(() => Promise.resolve({ data: {} })),
    put:    jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response:{ use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    // axios.create() -> trả về instance giả
    create: () => instance,
    // axios.get(...) vẫn dùng được nếu code gọi trực tiếp axios
    get: instance.get,
    post: instance.post,
    put: instance.put,
    delete: instance.delete,
    interceptors: instance.interceptors,
    __instance: instance, // optional: tiện cho test tinh chỉnh
  };
});

/**
 * 2) Nếu dự án có file wrapper `src/axios.js` (thường export const api = axios.create(...)),
 *    ta mock luôn để mọi import { api } from './axios' nhận instance giả ở trên.
 *    (Nếu bạn KHÔNG có file src/axios.js thì vẫn giữ đoạn này — không ảnh hưởng.)
 */
jest.mock('./axios', () => {
  const axios = require('axios'); // lấy mock vừa định nghĩa ở trên
  return { api: axios.create() };
});

/**
 * 3) Mock jspdf + polyfill canvas.getContext để tránh lỗi của jsdom.
 */
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
});

// jsdom không có canvas.getContext: polyfill tối thiểu
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}

/**
 * 4) Mock Context mặc định để tránh lỗi setAuthorized is not a function.
 *    (Nếu app bạn không dùng Context/Context thì đoạn này cũng vô hại.)
 */
jest.mock('./Context/Context', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      authorized: false,
      setAuthorized: jest.fn(),
    }),
  };
});
