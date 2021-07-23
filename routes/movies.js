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
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    trailer: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    thumbnail: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    owner: Joi.string().length(24).hex(),
    movieId: Joi.string().required().min(1),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

module.exports = movieRouter;
