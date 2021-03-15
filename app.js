const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
const { apiLimiter } = require('./helpers/rate-limits');
const { StatusCode } = require('./helpers/constants');
const { publicDir } = require('./helpers/upload');

const contactsRouter = require('./routes/api/contacts/api-contacts');
const usersRouter = require('./routes/api/users/api-users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.static(publicDir));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));

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
