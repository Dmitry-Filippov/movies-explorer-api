const userRouter = require('express').Router();
const {
  celebrate,
  Joi
} = require('celebrate');
const {
  getCurrentUser,
  patchCurrentUser
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), patchCurrentUser);

module.exports = userRouter;