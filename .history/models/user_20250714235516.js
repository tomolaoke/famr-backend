// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Phone with country code
  country: { type: String, required: true }, // e.g., 'Nigeria', 'USA'
  state: { type: String, required: true }, // e.g., 'Lagos', 'California'
  city: { type: String, required: true }, // City/town/village
  currency: { type: String, required: true }, // e.g., 'NGN', 'USD'
  language: { type: String, required: true, default: 'en' }, // e.g., 'en', 'es'
  role: {
    type: String,
    enum: ['Farmer', 'Agent', 'Buyer', 'SeedBank', 'FarmLaborer', 'Trainer', 'FinancialProvider', 'Warehousing', 'Transporter', 'Admin'],
    default: 'Farmer',
  },
  type: {
    type: String,
    enum: ['Individual', 'Company', 'Organization'],
    default: 'Individual',
  },
  bio: { type: String },
  profilePic: { type: String }, // URL to image
  visitHistory: [{ category: String, subcategory: String, timestamp: Date }], // For AI matching
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password and PIN before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

// Method to check password during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check PIN during login
UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', UserSchema);