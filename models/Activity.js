// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  category: { type: String },
  subcategory: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);