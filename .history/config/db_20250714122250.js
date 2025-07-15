// db.js - Connects to MongoDB database. This is like plugging in your app to a global storage system.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Connect using URL from .env
    console.log('MongoDB connected successfully');  // Success message
  } catch (err) {
    console.error('MongoDB connection failed:', err);  // Error if something goes wrong
    process.exit(1);  // Stop the server if DB fails
  }
};

module.exports = connectDB;