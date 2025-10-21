// src/setupTests.js
import '@testing-library/jest-dom';

// ---- Mock axios (toàn cục) ----
jest.mock('axios', () => {
  const mock = {
    get:    jest.fn(() => Promise.resolve({ data: [] })),
    post:   jest.fn(() => Promise.resolve({ data: {} })),
    put:    jest.fn(() => Promise.resolve({ data: {} })),
    patch:  jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),

    // axios.create() trả về "instance" có cùng API
    create: jest.fn(function () { return mock; }),

    // cho code không lỗi khi chạm interceptors/headers
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response:{ use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  };
  return mock;
});

// ---- Mock jsPDF (tránh lỗi canvas trong JSDOM) ----
jest.mock('jspdf', () => {
  return function JsPDF() {
    return {
      addImage: jest.fn(),
      text:     jest.fn(),
      save:     jest.fn(),
    };
  };
});

// ---- Fake canvas.getContext cho JSDOM ----
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({}),
  });
}
