const express = require('express');

const app = express();
const {
  PORT = 3000,
} = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(bodyParser.json());

app.use(requestLogger);
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
app.use('/', userRouter);
app.use('/', movieRouter);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
