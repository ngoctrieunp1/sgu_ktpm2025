// src/App.test.js
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Context } from './Context/Context';
import App from './App';

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
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Context.Provider>
  );
});
