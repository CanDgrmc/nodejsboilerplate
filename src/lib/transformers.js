module.exports = {
  transformAPIMovie: (data) => ({
    title: data?.Title,
    released: data?.Released,
    genre: data?.Genre,
    director: data?.Director,
  }),
  transformMovies: (data) => data.map((d) => ({
    title: d?.title,
    released: d?.released,
    genre: d?.genre,
    director: d?.director,
  })),
};
