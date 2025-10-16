// Client/my-app/src/__mocks__/axios.js

// instance giả dùng cho mọi lời gọi API trong test
const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  // nếu code của bạn có dùng interceptors, thêm cấu trúc này cho an toàn
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
};

// “axios” mock: có create() trả về instance
const mockAxios = {
  create: jest.fn(() => mockAxiosInstance),
  // cũng map trực tiếp các method để code nào dùng axios.get(...) vẫn chạy
  get: mockAxiosInstance.get,
  post: mockAxiosInstance.post,
  put: mockAxiosInstance.put,
  delete: mockAxiosInstance.delete,
  interceptors: mockAxiosInstance.interceptors,
};

export default mockAxios;
