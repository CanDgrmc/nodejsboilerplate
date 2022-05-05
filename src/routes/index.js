module.exports = [
  {
    path: '/movies',
    method: 'get',
    auth: true,
    service: 'movieService@getMovies',
  },
  {
    path: '/movies',
    method: 'post',
    auth: true,
    service: 'movieService@postMovieByTitle',
  },
  {
    path: '/auth',
    method: 'post',
    auth: false,
    service: 'authService@login',
  },
];
