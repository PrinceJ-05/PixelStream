const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Watchlist = require('../models/Watchlist');

const PLAN_DATA = {
  Mini: { cost: 99, quality: '720p', maxDevices: 1, watchlistLimit: 5 },
  Family: { cost: 199, quality: '1080p', maxDevices: 4, watchlistLimit: 50 },
  Ultra: { cost: 299, quality: '4K HDR', maxDevices: 6, watchlistLimit: 100 }
};

// POST /subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, planName } = req.body;
    
    if (!PLAN_DATA[planName]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Check if user already has active sub with SAME planName
    const existingSub = await Subscription.findOne({ 
      userId, 
      planName, 
      isActive: true 
    });
    
    if (existingSub) {
      // Auto-expire check before failing
      if (new Date(existingSub.expiryDate) < new Date()) {
        existingSub.isActive = false;
        await existingSub.save();
      } else {
        return res.status(400).json({ error: 'Active subscription already exists' });
      }
    }
    
    // If different plan or expired, just create a new one (or deactivate other active plans)
    await Subscription.updateMany({ userId, isActive: true }, { isActive: false });

    const plan = PLAN_DATA[planName];

    const subscription = new Subscription({
      userId,
      planName,
      monthlyCost: plan.cost,
      streamingQuality: plan.quality,
      maxDevices: plan.maxDevices,
      watchlistLimit: plan.watchlistLimit
      // expiryDate is auto-calculated by pre-save hook
    });

    await subscription.save();
    
    // Provision a new watchlist for this subscription
    const watchlist = new Watchlist({
      userId,
      subscriptionId: subscription._id
    });
    await watchlist.save();

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /subscription/renew/:id
router.put('/subscription/renew/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // validityDays is 30 by default, add to current Date.now()
    subscription.expiryDate = new Date(Date.now() + subscription.validityDays * 86400000);
    subscription.isActive = true;
    
    await subscription.save();

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
