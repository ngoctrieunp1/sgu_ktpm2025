// src/__mocks__/axios.js
const mockAxios = {
  // HTTP methods -> Promise giống axios thật
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({})),

  // axios.create() trả về "instance" có cùng API
  create: jest.fn(function () {
    return mockAxios;
  }),

  // Để code không lỗi khi động vào interceptors / headers
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: { headers: { common: {} } },
};

// Hỗ trợ CJS và ESM default import
module.exports = mockAxios;
module.exports.default = mockAxios;
