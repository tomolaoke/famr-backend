// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'view', 'create', 'login', 'transaction'
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  category: { type: String }, // For visit history
  subcategory: { type: String }, // For visit history
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);