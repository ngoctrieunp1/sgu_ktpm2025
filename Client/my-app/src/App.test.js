import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';

// ⚠️ KHÔNG bọc thêm MemoryRouter/BrowserRouter ở đây
// vì App.js của bạn đã bọc Router rồi.

test('App renders without crashing', () => {
  // Giá trị context tối thiểu để App mount không lỗi.
  const contextValue = {
    backendUrl: 'http://localhost:4000',
    currency: '₫',
    cartItems: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    getTotalCartAmount: jest.fn(() => 0),
    token: '',
    setToken: jest.fn(),
    user: null,
    setUser: jest.fn(),
    // thêm gì nữa nếu App/child component có đọc
  };

  render(
    <Context.Provider value={contextValue}>
      <App />
    </Context.Provider>
  );
});
