// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Phone with country code, e.g., +2349012345678
  country: { type: String, required: true },
  state: { type: String, required: true }, // Added state field
  city: { type: String, required: true }, // City/town/village
  role: {
    type: String,
    enum: ['Farmer', 'Agent', 'Buyer', 'Seeds Bank', 'Farm Labourer', 'Trainer', 'Financial Service Provider', 'Warehousing', 'Transporter', 'Admin'],
    default: 'Farmer',
  },
  bio: { type: String },
  picture: { type: String },
  entityType: {
    type: String,
    enum: ['Individual', 'Company', 'Organization'],
    default: 'Individual',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);