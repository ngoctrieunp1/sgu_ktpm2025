import '@testing-library/jest-dom';

// jsdom không có canvas -> mock để tránh lỗi
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = jest.fn();
}

// mock matchMedia (nhiều thư viện UI cần)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Cho Jest biết dùng mock axios ở __mocks__/axios.js
jest.mock('axios');

// Mock Context để tránh lỗi setAuthorized undefined
jest.mock('./Context/Context', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      setAuthorized: jest.fn(),
      setUser: jest.fn(),
      setRole: jest.fn(),
      authorized: false,
      user: null,
      role: null,
    }),
  };
});
