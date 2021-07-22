const NotFoundError = require('../errrors/not-found-err');

module.exports = (req, res, next) => {
  next(new NotFoundError('Ошибка роутизации'));
};
