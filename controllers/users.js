const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b' } = process.env;


const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        console.log(user)
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      console.log(err);
    })
    .catch(next)
};

const patchCurrentUser = (req, res, next) => {
  const {
    name,
    about
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
      name,
      about
    })
    .then(user => res.send(user))
    .catch(err => {
      console.log(err)
    })
    .catch(next)
};

const login = (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id
      }, JWT_SECRET, {
        expiresIn: '7d'
      });
      res.send({
        token
      });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
        name,
        email,
        password: hash,
      })
      .then(({
        name,
        _id,
        email,
      }) => res.send({
        name,
        _id,
        email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          console.log(err);
          throw new ValidationError('Переданы некорректные данные');
        } else if (err.name === 'MongoError' && err.code === 11000) {
          throw new UniqueError('Пользователь с таким email уже существует');
        } else {
          throw new DefaultError(`Произошла ошибка: ${err}`);
        }
      })
      .catch(next);
  });
}

module.exports = {
  getCurrentUser,
  patchCurrentUser,
  login,
  createUser
}