// User.js - Schema for users. Stores info like name, location (for global use), role, etc.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Unique to prevent duplicates
  password: { type: String, required: true },
  pin: { type: String, required: true },  // For extra security
  country: { type: String, required: true },  // Global: e.g., 'Nigeria' or 'USA'
  state: { type: String },  // Optional, based on country
  city: { type: String, required: true },
  currency: { type: String, required: true },  // e.g., 'NGN' or 'USD'
  phone: { type: String },  // Optional
  role: { type: String, enum: ['Agent', 'Farmer', 'SeedBank', 'Buyer', 'FarmLaborer', 'Trainer', 'FinancialProvider', 'Warehousing', 'Transporter'], default: 'Farmer' },  // Roles from PRD
  type: { type: String, enum: ['Individual', 'Company', 'Organization'] },  // From profile update
  bio: { type: String },
  profilePic: { type: String },  // URL to image
  visitHistory: [{ category: String, timestamp: Date }]  // For AI matching (tracks what they view)
});

// Before saving, hash the password for security
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);  // 10 is a secure salt level
  next();
});

// Method to check password during login
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


