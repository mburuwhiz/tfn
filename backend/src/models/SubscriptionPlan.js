const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speed: { type: String, required: true }, // e.g. "100 Mbps"
  price: { type: Number, required: true },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
