module.exports = (req, res, next) => {
  res.status(404).send({ message: 'Ошибка роутизации' });
  next();
};
