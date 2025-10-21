import '@testing-library/jest-dom';

// ✅ Mock axios (toàn cục)
jest.mock('axios', () => {
  const mock = {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(function () { return mock; }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  };
  return mock;
});

// ✅ Mock jsPDF (tránh lỗi canvas)
jest.mock('jspdf', () => {
  return function JsPDF() {
    return {
      addImage: jest.fn(),
      text: jest.fn(),
      save: jest.fn(),
    };
  };
});

// ✅ Fake canvas.getContext
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}

// ✅ Mock Context để App không crash
jest.mock('./Context/Context', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      authorized: false,
      setAuthorized: jest.fn(),
      user: null,
      setUser: jest.fn(), // quan trọng nhất
      role: null,
      setRole: jest.fn(),
      cart: [],
      setCart: jest.fn(),
    }),
  };
});
