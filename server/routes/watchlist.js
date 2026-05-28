const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const Subscription = require('../models/Subscription');

// POST /watchlist/add
router.post('/add', async (req, res) => {
  try {
    const { userId, movie } = req.body;
    
    if (!movie || !movie.title) return res.status(400).json({ error: 'Movie object with title is required' });

    // Find user's active subscription to get watchlistLimit
    const subscription = await Subscription.findOne({ userId, isActive: true });
    
    if (!subscription) {
      return res.status(403).json({ error: 'No active subscription found. Please subscribe to add movies.' });
    }
    
    // Auto-expire check
    if (new Date(subscription.expiryDate) < new Date()) {
      subscription.isActive = false;
      await subscription.save();
      return res.status(403).json({ error: 'Subscription expired' });
    }

    // Find user's watchlist for this subscription
    let watchlist = await Watchlist.findOne({ subscriptionId: subscription._id });
    if (!watchlist) {
      // Create if missing for some reason
      watchlist = new Watchlist({ userId, subscriptionId: subscription._id, movies: [] });
    }

    // Check limit
    if (watchlist.movies.length >= subscription.watchlistLimit) {
      return res.status(400).json({ error: 'Watchlist limit exceeded for your plan' });
    }

    if (watchlist.movies.some(m => m.title === movie.title)) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    watchlist.movies.push(movie);
    await watchlist.save();

    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /watchlist/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find active subscription to get the correct watchlist
    const subscription = await Subscription.findOne({ userId, isActive: true });
    if (!subscription) {
      return res.json({ movies: [], limit: 0 }); // No active sub means no active watchlist
    }

    const watchlist = await Watchlist.findOne({ subscriptionId: subscription._id })
                                     .populate('subscriptionId');
                                     
    if (!watchlist) {
      return res.json({ movies: [], limit: subscription.watchlistLimit, subscription });
    }

    res.json({ 
      movies: watchlist.movies, 
      limit: subscription.watchlistLimit,
      subscription 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
