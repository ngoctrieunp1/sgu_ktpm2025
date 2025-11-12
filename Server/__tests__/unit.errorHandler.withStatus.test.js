const httpMocks = require('node-mocks-http');
const errorHandler = require('../MiddleWare/errorHandler');

describe('Unit: errorHandler (có status & message)', () => {
  it('trả đúng status và message', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const err = { status: 400, message: 'Bad Request' };

    errorHandler(err, req, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Bad Request' });
  });
});
