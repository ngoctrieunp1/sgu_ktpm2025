import '@testing-library/jest-dom';

// Kích hoạt manual mock trong __mocks__/axios.js
jest.mock('axios');

// Mock file axios.js (wrapper)
jest.mock('./axios', () => {
  const axios = require('axios'); // lấy mock ở trên
  return { api: axios.create() };
});

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }));
});

// Polyfill canvas
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}

// Mock Context
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
