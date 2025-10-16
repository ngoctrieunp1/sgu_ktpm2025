// __mocks__/axios.js
// Manual mock cho axios để Jest dùng thay vì package thật.
// Hỗ trợ cả default export lẫn các method như axios thật.

const mockAxios = {
  // HTTP methods trả về Promise giống axios
  get:    jest.fn().mockResolvedValue({ data: [] }),
  post:   jest.fn().mockResolvedValue({ data: {} }),
  put:    jest.fn().mockResolvedValue({ data: {} }),
  patch:  jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({}),

  // axios.create() trả về chính "instance" này
  create: jest.fn(function () {
    return mockAxios;
  }),

  // Cho code dùng interceptors / headers không bị lỗi
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response:{ use: jest.fn(), eject: jest.fn() },
  },
  defaults: { headers: { common: {} } },
};

// Xuất ra theo kiểu CJS + ESModule để default import hoạt động chuẩn
module.exports = {
  __esModule: true,
  default: mockAxios,  // hỗ trợ `import axios from 'axios'`
  ...mockAxios,        // hỗ trợ `axios.get`, `axios.create`, ...
};
