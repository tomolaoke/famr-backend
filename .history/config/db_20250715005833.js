// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    const User = require('../models/User');
    const Listing = require('../models/Listing');
    const QueuedAction = require('../models/QueuedAction');
    await User.createIndex({ email: 1, phone: 1 });
    await Listing.createIndex({ category: 1, subcategory: 1, country: 1 });
    await QueuedAction.createIndex({ userId: 1, createdAt: 1 });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
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