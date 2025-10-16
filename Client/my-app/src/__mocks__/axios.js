// __mocks__/axios.js
// Manual mock cho axios để Jest dùng thay vì package thật.

const mockAxios = {
  // Các HTTP method trả về Promise như axios thật
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

export default mockAxios;
