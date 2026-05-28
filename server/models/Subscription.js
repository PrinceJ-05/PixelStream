const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { 
    type: String, 
    enum: ['Mini', 'Family', 'Ultra'], 
    required: true 
  },
  monthlyCost: { type: Number, required: true },
  streamingQuality: { type: String, required: true },
  maxDevices: { type: Number, required: true },
  watchlistLimit: { type: Number, required: true },
  validityDays: { type: Number, default: 30 },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

subscriptionSchema.pre('save', function() {
  if (this.isModified('validityDays') || this.isNew) {
    // auto-calculates expiryDate = Date.now() + validityDays × 86400000
    this.expiryDate = new Date(Date.now() + this.validityDays * 86400000);
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
