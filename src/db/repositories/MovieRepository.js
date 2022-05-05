const moment = require('moment');
const Base = require('./Base');

class MovieRepository extends Base {
  constructor(db, logger) {
    super(db, logger);
    this.movieModel = this.db.model('Movie');
  }

  async getUserMovies(userId) {
    const movies = await this.movieModel.find({
      userId,
    });
    return movies;
  }

  async countUserMoviesMonthly(userId) {
    const beginningOfMonth = moment().startOf('month').valueOf();
    const count = await this.movieModel.count({
      userId,
      createdAt: {
        $gt: beginningOfMonth,
      },
    });
    return count;
  }

  async createMovie(movie, userId) {
    try {
      await this.movieModel.create({ ...movie, userId });
      return true;
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
  }
}

module.exports = MovieRepository;
