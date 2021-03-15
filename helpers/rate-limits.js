const rateLimit = require('express-rate-limit');
const { StatusCode } = require('./constants');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'error',
      code: StatusCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Too many requests. Please try again later.',
    });
  },
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  handler: (_req, res, _next) => {
    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'error',
      code: StatusCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Too many registration. No more than 2 per hour from 1 IP',
    });
  },
});

module.exports = {
  apiLimiter,
  createAccountLimiter,
};
