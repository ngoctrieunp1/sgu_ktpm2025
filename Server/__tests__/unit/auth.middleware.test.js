const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User.model');
const Auth = require('../../MiddleWare/Auth');

jest.mock('jsonwebtoken');
jest.mock('../../Models/User.model');

describe('Auth Middleware - Unit Test', () => {
  
  it('should return 401 if Authorization header is missing', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await Auth(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toHaveProperty('message', 'No token provided');
  });

  it('should return 500 if jwt.verify throws error', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalidtoken' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    await Auth(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty('message');
  });

  it('should return 401 if user decoded from token does not exist', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer validtoken' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: '123' });
    User.findById.mockResolvedValue(null);

    await Auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toHaveProperty('message', 'User not found');
  });

  it('should call next() when token is valid and user exists', async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer validtoken' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: '123' });
    User.findById.mockResolvedValue({ _id: '123', name: 'John Doe' });

    await Auth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
  });
});
