// controllers/adminController.js
const User = require('../models/User');
const Listing = require('../models/Listing');
const Activity = require('../models/Activity');
const QueuedAction = require('../models/QueuedAction');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const agentSignUps = await User.countDocuments({ role: 'Agent' });
    const loginCount = await Activity.countDocuments({ action: 'login' });
    const listingCount = await Listing.countDocuments();
    const warehousingCount = await Listing.countDocuments({ category: 'warehousing', subcategory: 'warehouse-storage' });
    const transportationCount = await Listing.countDocuments({ category: 'warehousing', subcategory: 'transportation' });
    const transactionCount = await Activity.countDocuments({ action: 'transaction' });
    const activeUsers = await Activity.countDocuments({ action: 'view', timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const offlineUsers = await QueuedAction.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const usersByCountry = await User.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalUsers,
      activeUsers,
      agentSignUps,
      loginCount,
      listingCount,
      warehousingCount,
      transportationCount,
      transactionCount,
      offlineUsers,
      usersByCountry,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email phone country state city currency role createdAt');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('userId', 'firstName lastName currency');
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};