const httpMocks = require('node-mocks-http');
const notFound = require('../MiddleWare/notFound');

describe('Unit: notFound middleware', () => {
  it('trả 404 và {error:"Not Found"}', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    notFound(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Not Found' });
  });
});
