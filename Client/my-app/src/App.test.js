import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';

// Smoke test: chỉ cần render được App (không throw) là pass.
// Bọc App bằng Context.Provider với đúng shape mà App đang dùng.
test('App renders without crashing', () => {
  const contextValue = {
    user: null,
    setUser: jest.fn(),
    authorized: false,
    setAuthorized: jest.fn(),
  };

  render(
    <Context.Provider value={contextValue}>
      <App />
    </Context.Provider>
  );
});
