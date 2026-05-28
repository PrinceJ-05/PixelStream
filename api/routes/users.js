const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users/create
router.post('/create', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ error: 'User already exists', user }); // Returning user to allow auto-login for demo
    }
    
    user = new User({ name, email });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/email/:email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
