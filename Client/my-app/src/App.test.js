import { render } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';
import axios from 'axios';

jest.mock('axios');

test('App renders without crashing', () => {
  // Giá trị mock context
  const ctxValue = {
    authorized: true,
    setAuthorized: jest.fn(),
    user: { name: 'test' },
    setUser: jest.fn(),
    role: 'user',
    setRole: jest.fn(),
    cart: [],
    setCart: jest.fn(),
  };

  // Mock axios.get trả về rỗng để FoodItem không crash
  axios.get.mockResolvedValueOnce({ data: [] });

  render(
    <Context.Provider value={ctxValue}>
      <App />
    </Context.Provider>
  );
});
