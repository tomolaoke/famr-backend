// adminController.js - Computes metrics like user counts.

const User = require('../models/User');
const Listing = require('../models/Listing');

const getMetrics = async () => {
  return {
    signups: await User.countDocuments(),  // Total users
    activeUsers: 0,  // Placeholder; update with socket connections
    agentSignups: await User.countDocuments({ role: 'Agent' }),
    logins: await User.countDocuments({ /* Add login log field if needed */ }),  // Expand: Add a lastLogin field in User model
    listingsByCategory: await Listing.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    // Add more: e.g., usersByCountry: await User.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }])
    // For charts: These can be raw data; frontend renders charts
  };
};

module.exports = { getMetrics };