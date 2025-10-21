// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';

// Nếu App import các component nặng (gọi API/JS PDF) qua router,
// bạn có thể mock nhẹ chúng để test mục tiêu "render không crash"
// Ví dụ (bật nếu cần):
// jest.mock('./Components/MyOrders/Myorders', () => () => <div>MyOrders</div>);
// jest.mock('./Components/FoodItem/FoodItem', () => () => <div>FoodItem</div>);

test('App renders without crashing', async () => {
  const ctxValue = {
    // các giá trị tối thiểu để App không crash
    isAuthorized: true,
    setAuthorized: jest.fn(),
    cartItems: [],
    setCartItems: jest.fn(),
    // thêm gì nữa nếu App dùng (vd: user, setUser…)
  };

  render(
    <Context.Provider value={ctxValue}>
      <App />
    </Context.Provider>
  );

  // Chỉ cần đợi 1 text xuất hiện (chọn text có mặt trên màn hình Home/Header của bạn)
  // Đừng quá khắt khe; chỉ để xác nhận không crash.
  // Thay 'Home' bằng 1 text chắc chắn có trong App bạn.
  expect(await screen.findByText(/home|menu|order|food/i)).toBeTruthy();
});
