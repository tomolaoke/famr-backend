// recommendationController.js - Simple AI: Counts frequent categories and matches listings.

const User = require('../models/User');
const Listing = require('../models/Listing');

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simple "AI": Count visits per category
    const categoryCounts = user.visitHistory.reduce((acc, visit) => {
      acc[visit.category] = (acc[visit.category] || 0) + 1;
      return acc;
    }, {});

    // Get top category
    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || 'Warehousing';  // Default to main theme

    // Match: Find listings in top or related categories (expand this for real AI with ML libs)
    const relatedCategories = [topCategory, topCategory === 'Warehousing' ? 'Transporter' : topCategory];  // Example relation
    const recommendations = await Listing.find({ category: { $in: relatedCategories } }).limit(10);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Recommendations failed', error: err });
  }
};

module.exports = { getRecommendations };