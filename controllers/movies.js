const Movie = require('../models/movie');
const NotFoundError = require('../errrors/not-found-err');
const DefaultError = require('../errrors/default-err');
const ValidationError = require('../errrors/valid-err');
const ForbiddenError = require('../errrors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  }).then((movieItem) => res.send(movieItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie && movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movie) => {
            res.send(movie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new ValidationError('Переданы некорректные данные');
            } else if (err.name === 'NotFoundError') {
              throw new NotFoundError('Фильма с таким id не существует');
            } else {
              throw new DefaultError('Произошла ошибка');
            }
          })
          .catch(next);
      } else if (!movie) {
        throw new NotFoundError('Фильма с таким id не существует');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Не хватает прав для удаления карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('Фильма с таким id не существует');
      } else if (err.name === 'ForbiddenError') {
        throw new ForbiddenError('Не хватает прав для удаления карточки');
      } else {
        throw new DefaultError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
