const asyncHandler = require('../MiddleWare/asyncHandler');

describe('Unit: asyncHandler', () => {
  it('bắt lỗi async và gọi next(err)', async () => {
    const thrown = new Error('boom');
    const fn = async () => { throw thrown; };
    const wrapped = asyncHandler(fn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(thrown);
  });
});
