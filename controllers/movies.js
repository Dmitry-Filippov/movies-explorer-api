const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then(movies => res.send(movies))
    .catch(err => {
      console.log(err)
    })
    .catch(next)
}

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
    movieId
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
    movieId
  }).then(movieItem => res.send(movieItem))
    .catch(err => {console.log(err)})
    .catch(next)
}

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then(res => console.log(res))
    .catch(err => console.log(err))
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
}