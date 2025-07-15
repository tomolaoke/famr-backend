// controllers/recommendationController.js
const User = require('../models/User');
const Listing = require('../models/Listing');
const Activity = require('../models/Activity');

exports.logView = async (req, res) => {
  const { listingId } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const user = await User.findById(req.user.id);
    user.visitHistory.push({
      category: listing.category,
      subcategory: listing.subcategory,
      timestamp: Date.now(),
    });
    await user.save();

    await new Activity({
      userId: req.user.id,
      action: 'view',
      listingId,
      category: listing.category,
      subcategory: listing.subcategory,
    }).save();

    res.json({ message: 'View logged!' });
  } catch (error) {
    console.error('Log view error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const categories = [...new Set(user.visitHistory.map(h => h.category))];
    const subcategories = [...new Set(user.visitHistory.map(h => h.subcategory).filter(s => s))];
    const viewedListingIds = user.visitHistory.map(h => h.listingId).filter(id => id);

    const recommendations = await Listing.find({
      $or: [
        { category: { $in: categories } },
        { subcategory: { $in: subcategories } },
      ],
      _id: { $nin: viewedListingIds },
      currency: user.currency,
    })
      .populate('userId', 'firstName lastName email phone city state country currency')
      .limit(10);
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};