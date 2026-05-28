const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  genre: { type: String },
  rating: { type: String },
  year: { type: String }
}, { _id: false });

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  movies: { type: [movieSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
