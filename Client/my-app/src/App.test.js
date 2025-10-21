import { render } from '@testing-library/react';
import App from './App';
import { Context } from './Context/Context';

// Dùng mock axios đã setup
jest.mock('axios');

test('App renders without crashing', () => {
  const ctxValue = {
    setAuthorized: jest.fn(),
    setUser: jest.fn(),
    setRole: jest.fn(),
    authorized: false,
    user: null,
    role: null,
  };

  render(
    <Context.Provider value={ctxValue}>
      <App />
    </Context.Provider>
  );
});
