const Movie = (mongoose, db) => {
  const schema = new mongoose.Schema({
    title: { type: String, required: true },
    relased: Date,
    genre: String,
    director: String,
    userId: { type: Number, required: true },
    createdAt: { type: Number, default: new Date().valueOf() },
  });

  db.model('Movie', schema);
};

module.exports = Movie;
