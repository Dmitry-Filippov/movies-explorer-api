const movieRouter = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.delete('/movies/:movieId', deleteMovie);
movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    trailer: Joi.string(),
    thumbnail: Joi.string(),
    owner: Joi.string(),
    movieId: Joi.string(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
  }),
}), createMovie);

module.exports = movieRouter;
