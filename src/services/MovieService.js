const Base = require('./Base');
const {
  transformers: {
    transformAPIMovie,
    transformMovies,
  },
} = require('../lib');

class MovieService extends Base {
  async postMovieByTitle(req) {
    const {
      omdbClient,
    } = this.clients;
    const {
      movieRepository,
    } = this.repositories;
    const {
      user,
      body: {
        title,
      },
    } = req;

    // might be in middleware
    if (user.role !== 'premium') {
      const countMovies = await movieRepository.countUserMoviesMonthly(user.userId);

      if (countMovies >= this.config.get('MONTHLY_FREE_USAGE')) {
        this.logger.error('monthly-free-usage-exceeded');
        throw new Error('monthly-free-usage-exceeded');
      }
    }

    const response = await omdbClient.getMovieByTitle(title);
    const res = transformAPIMovie(response);
    await movieRepository.createMovie(res, user.userId);

    return res;
  }

  async getMovies(req) {
    const {
      movieRepository,
    } = this.repositories;
    try {
      const response = await movieRepository.getUserMovies(req.user.userId);
      return transformMovies(response);
    } catch (err) {
      throw new Error('external-error');
    }
  }
}

module.exports = MovieService;
