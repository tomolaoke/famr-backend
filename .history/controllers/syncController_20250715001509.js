// controllers/syncController.js
const QueuedAction = require('../models/QueuedAction');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { countries } = require('countries-list');
const validatePhone = require('../utils/validatePhone');
const bcrypt = require('bcryptjs');

exports.syncActions = async (req, res) => {
  const { actions } = req.body; // Array of queued actions
  try {
    const results = [];
    for (const action of actions) {
      const { actionType, data } = action;
      let result;

      if (actionType === 'signup') {
        const { firstName, lastName, email, password, confirmPassword, pin, phone, country, state, city, currency, language } = data;

        if (password !== confirmPassword) {
          results.push({ actionType, success: false, error: 'Passwords do not match' });
          continue;
        }

        const countryData = Object.values(countries).find(c => c.name === country);
        if (!countryData || countryData.currency !== currency) {
          results.push({ actionType, success: false, error: 'Invalid currency' });
          continue;
        }

        if (!validatePhone(phone)) {
          results.push({ actionType, success: false, error: 'Invalid phone number' });
          continue;
        }

        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
          results.push({ actionType, success: false, error: 'Email or phone already exists' });
          continue;
        }

        user = new User({
          firstName,
          lastName,
          email,
          password,
          pin,
          phone,
          country,
          state,
          city,
          currency,
          language,
        });
        await user.save();
        results.push({ actionType, success: true, userId: user._id });
      } else if (actionType === 'createListing') {
        const { category, subcategory, name, description, features, currency } = data;
        const user = await User.findById(req.user.id);
        if (!user) {
          results.push({ actionType, success: false, error: 'User not found' });
          continue;
        }

        const countryData = Object.values(countries).find(c => c.name === user.country);
        if (!countryData || countryData.currency !== currency) {
          results.push({ actionType, success: false, error: 'Invalid currency' });
          continue;
        }

        if (category === 'warehousing' && !['warehouse-storage', 'transportation'].includes(subcategory)) {
          results.push({ actionType, success: false, error: 'Invalid subcategory' });
          continue;
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
        results.push({ actionType, success: true, listingId: listing._id });
      }
    }

    // Clear queued actions
    await QueuedAction.deleteMany({ userId: req.user.id });
    res.json({ message: 'Sync completed', results });
  } catch (error) {
    console.error('Sync actions error:', error.message);
    res.status(500).json({ message: 'Server error during sync' });
  }
};