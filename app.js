const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { StatusCode } = require('./helpers/constants');

const contactsRouter = require('./routes/api/contacts/api-contacts');
const usersRouter = require('./routes/api/users/api-users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'error',
      code: StatusCode.BAD_REQUEST,
      data: 'bad request',
      message: 'Too many requests. Please try again later.',
    });
  },
});
app.use('/api/', apiLimiter);

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res.status(StatusCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res
    .status(err.status || StatusCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;
