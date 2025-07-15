// controllers/listingController.js
const { check, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { countries } = require('countries-list');

exports.getListings = async (req, res) => {
  try {
    const query = { category: req.params.category };
    if (req.params.category === 'warehousing' && req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    const listings = await Listing.find(query)
      .populate('userId', 'firstName lastName email phone city state country currency');
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createListing = [
  check('category', 'Category is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('currency', 'Currency is required').not().isEmpty(),
  check('subcategory', 'Subcategory is required for warehousing').custom((value, { req }) => {
    if (req.body.category === 'warehousing' && !['warehouse-storage', 'transportation'].includes(value)) {
      throw new Error('Invalid subcategory for warehousing');
    }
    if (req.body.category !== 'warehousing' && value) {
      throw new Error('Subcategory only applies to warehousing');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, subcategory, name, description, features, currency } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Validate currency matches user's country
      const countryData = Object.values(countries).find(c => c.name === user.country);
      if (!countryData || countryData.currency !== currency) {
        return res.status(400).json({ message: 'Invalid currency for user’s country' });
      }

      const listing = new Listing({
        category,
        subcategory: category === 'warehousing' ? subcategory : null,
        name,
        description,
        features,
        currency,
        userId: req.user.id,
        contact: {
          phone: user.phone,
          email: user.email,
          city: user.city,
          state: user.state,
          country: user.country,
        },
      });
      await listing.save();

      // Log create activity
      const Activity = require('../models/Activity');
      await new Activity({
        userId: req.user.id,
        action: 'create',
        listingId: listing._id,
        category,
        subcategory,
      }).save();

      res.json({ listingId: listing._id, message: 'Listing created!' });
    } catch (error) {
      console.error('Create listing error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

exports.getListingDetails = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone city state country currency');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    console.error('Get listing details error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};