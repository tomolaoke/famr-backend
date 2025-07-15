// Listing.js - Schema for listings (e.g., a warehouse service). Global filtering via location.

const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Who created it
  category: { type: String, required: true },  // e.g., 'Warehousing', 'SellProduce'
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [String],  // Array of details (e.g., 'Solar-powered')
  contact: {
    phone: String,
    email: String,
    location: { city: String, state: String, country: String }
  },
  image: { type: String },  // URL to image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);