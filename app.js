const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const {
  PORT = 4000,
  MONGOLINK = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const invalidRoutes = require('./middlewares/invalidRoutes');
const { limiter } = require('./middlewares/rateLimiter');
const {
  login,
  createUser,
} = require('./controllers/users');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

mongoose.connect(MONGOLINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
      }),
  }),
  createUser,
);
app.use(auth);
app.use('/', router);
app.use(invalidRoutes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
