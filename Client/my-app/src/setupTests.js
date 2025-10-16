// jest-dom adds custom jest matchers for asserting on DOM nodes.
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * 1) Bảo Jest dùng manual mock ở thư mục __mocks__/axios.js
 * (file này bạn vừa paste ở trên).
 */
jest.mock('axios');

/**
 * 2) Nếu project có file src/axios.js (export const api = axios.create(...)),
 *    mock luôn module này để tất cả import { api } dùng instance axios giả.
 *    Không có file đó cũng không sao.
 */
jest.mock('./axios', () => {
  const axios = require('axios'); // lấy mock ở trên
  return { api: axios.create() };
});

/**
 * 3) Mock jsPDF + polyfill canvas.getContext để tránh crash jsdom.
 */
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    text: jest.fn(),
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
 * 4) Mock Context mặc định để tránh lỗi setUser/setRole/addCart... is not a function.
 *    Thêm các field mà App/FoodItem/Components dùng tới.
 */
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
      addCart: jest.fn(),   // FoodItem dùng addCart
      cart: [],
      setCart: jest.fn(),
    }),
  };
});
