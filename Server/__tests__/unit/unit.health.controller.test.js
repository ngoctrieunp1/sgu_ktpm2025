const httpMocks = require('node-mocks-http');
const { health } = require('../../Controllers/health.controller');

describe('Unit: health.controller', () => {
  it('trả 200 và {status:"ok"}', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    health(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ status: 'ok' });
  });
});