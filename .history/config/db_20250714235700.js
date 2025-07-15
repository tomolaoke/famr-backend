// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    // Create indexes for performance
    const User = require('../models/User');
    const Listing = require('../models/Listing');
    await User.createIndex({ email: 1, phone: 1 });
    await Listing.createIndex({ category: 1, subcategory: 1, country: 1 });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;