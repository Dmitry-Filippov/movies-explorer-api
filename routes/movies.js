const movieRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.delete('/movies/:movieId', deleteMovie);
movieRouter.post('/movies', createMovie);

module.exports = movieRouter;