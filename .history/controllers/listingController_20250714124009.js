// listingController.js - Handles creating and fetching listings. Global filtering included.

const Listing = require('../models/Listing');
const User = require('../models/User');

// Create Listing (auth required)
const createListing = async (req, res) => {
  const { category, title, description, features, contact, image } = req.body;
  try {
    const listing = new Listing({
      userId: req.user.id,
      category,
      title,
      description,
      features,
      contact,
      image
    });
    await listing.save();
    res.status(201).json({ listingId: listing._id });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err });
  }
};

// Get Listings by Category (with global filters)
const getListingsByCategory = async (req, res) => {
  const { category } = req.params;
  const { country, city, currency } = req.query;  // Filters from query params

  const filters = { category };
  if (country) filters['contact.location.country'] = country;
  if (city) filters['contact.location.city'] = city;
  // Currency not directly filtered, but can be added if listings have price

  try {
    const listings = await Listing.find(filters);
    // If logged in, track visit for AI
    if (req.user) {
      const user = await User.findById(req.user.id);
      user.visitHistory.push({ category, timestamp: new Date() });
      await user.save();
    }
    res.json(listings);  // Returns array with id, image, name (from populated?), etc. (Populate if needed)
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err });
  }
};

// Get Single Listing
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err });
  }
};

module.exports = { createListing, getListingsByCategory, getListingById };