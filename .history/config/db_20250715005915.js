

// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('famr MongoDB connected successfully');
    const User = require('../models/User');
    const Listing = require('../models/Listing');
    const QueuedAction = require('../models/QueuedAction');
    // Define indexes in schemas instead
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;