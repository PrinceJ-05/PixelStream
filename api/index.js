require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const watchlistRoutes = require('./routes/watchlist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins for Vercel deployment
app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Vercel serverless function export
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
