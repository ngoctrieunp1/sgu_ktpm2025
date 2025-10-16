// src/setupTests.js
import '@testing-library/jest-dom';

// 1) Dùng manual mock trong src/__mocks__/axios.js
jest.mock('axios');

// 2) Mock wrapper ./axios để mọi import { api } dùng cùng instance axios giả
jest.mock('./axios', () => {
  const axios = require('axios');      // <-- chính là mock ở trên
  return { api: axios.create() };
});

// 3) Polyfill canvas cho jsdom
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}

// 4) Mock Context mặc định (thêm các field mà app dùng)
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

// 5) (Tuỳ chọn) Nếu dự án có dùng jsPDF ở test, mở phần này
// jest.mock('jspdf', () => {
//   return jest.fn().mockImplementation(() => ({
//     addImage: jest.fn(),
//     text: jest.fn(),
//     save: jest.fn(),
//   }));
// });
