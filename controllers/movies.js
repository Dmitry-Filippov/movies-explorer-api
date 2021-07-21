const Movie = require('../models/movie');
const NotFoundError = require('../errrors/not-found-err');
const DefaultError = require('../errrors/default-err');
const ValidationError = require('../errrors/valid-err');
const UniqueError = require('../errrors/unique-err');
const AuthError = require('../errrors/auth-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      throw new DefaultError(`Произошла ошибка: ${err}`);
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
  }).then((movieItem) => res.send(movieItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new DefaultError(`Произошла ошибка: ${err}`);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  let dealeatable = false;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie.owner === req.user._id) {
        dealeatable = true;
      }
    });
  if (dealeatable) {
    Movie.findByIdAndRemove(req.params.movieId)
      .then((res) => console.log(res))
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new ValidationError('Переданы некорректные данные');
        } else {
          throw new DefaultError(`Произошла ошибка: ${err}`);
        }
      })
      .catch(next);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
