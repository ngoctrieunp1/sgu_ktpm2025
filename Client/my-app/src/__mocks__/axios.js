// Client/my-app/src/__mocks__/axios.js
const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({})),

  create: jest.fn(function () {
    return mockAxios;
  }),

  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },

  defaults: { headers: { common: {} } },
};

module.exports = mockAxios;
module.exports.default = mockAxios;
