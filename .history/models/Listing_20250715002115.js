// models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['power-kiosk', 'warehousing', 'sell-produce', 'farm-labor', 'tools-equipments', 'seed-banks', 'loans-grants', 'training'],
    required: true,
  },
  subcategory: {
    type: String,
    enum: ['warehouse-storage', 'transportation', null],
    default: null,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  currency: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);