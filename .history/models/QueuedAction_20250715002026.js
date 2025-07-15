// models/QueuedAction.js
const mongoose = require('mongoose');

const queuedActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, enum: ['signup', 'createListing'], required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QueuedAction', queuedActionSchema);