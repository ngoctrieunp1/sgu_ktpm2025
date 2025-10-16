// Kích hoạt jest-dom (matcher như toBeInTheDocument, v.v.)
import '@testing-library/jest-dom';

// Dùng mock axios trong src/__mocks__/axios.js
jest.mock('axios');

// Tránh lỗi jsdom khi có <canvas> (ví dụ jspdf/qr code, chart…)
if (!window.HTMLCanvasElement.prototype.getContext) {
  window.HTMLCanvasElement.prototype.getContext = () => ({});
}

// Mock jsPDF để import không bị crash trong môi trường test
jest.mock('jspdf', () =>
  jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
    text: jest.fn(),
  }))
);

// (Tuỳ chọn) tránh warning nếu code gọi window.scrollTo
if (!window.scrollTo) {
  window.scrollTo = () => {};
}
