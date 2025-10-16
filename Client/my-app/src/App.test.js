import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';

// Smoke test: chỉ cần render được App là pass.
test('App renders without crashing', () => {
  const contextValue = {
    user: null,
    setUser: jest.fn(),
    role: null,
    setRole: jest.fn(),
    authorized: false,
    setAuthorized: jest.fn(),
    addCart: jest.fn(),
    cart: [],
    setCart: jest.fn(),
  };

  render(
    <Context.Provider value={contextValue}>
      <App />
    </Context.Provider>
  );
});
