// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  currency: { type: String, required: true },
  language: { type: String, required: true, default: 'en' },
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
  profilePic: { type: String },
  visitHistory: [{ category: String, subcategory: String, timestamp: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', UserSchema);