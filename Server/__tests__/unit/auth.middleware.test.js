const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const UserCollection = require('../../models/UserModels');
const isAuthenticated = require('../../MiddleWare/Auth');

jest.mock('jsonwebtoken');
jest.mock('../../models/UserModels');

describe('Auth middleware - unit', () => {
  it('should return 401 when Authorization header is missing', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await isAuthenticated(req, res, next);

    expect(res.statusCode).toBe(401);
    // dùng _getData vì middleware dùng res.send(...)
    expect(res._getData()).toEqual({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token has no sub', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer faketoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({}); // không có sub

    await isAuthenticated(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when user not found', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer faketoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ sub: { _id: '123' } });
    UserCollection.findById.mockResolvedValue(null);

    await isAuthenticated(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ message: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 when jwt.verify throws', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer faketoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('boom');
    });

    await isAuthenticated(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({ message: 'Internal server error' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() and set req.user when token & user valid', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer validtoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const fakeUser = { _id: '123', name: 'Test' };

    jwt.verify.mockReturnValue({ sub: { _id: '123' } });
    UserCollection.findById.mockResolvedValue(fakeUser);

    await isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual(fakeUser);
  });
});
