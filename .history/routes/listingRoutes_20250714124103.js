const express = require('express');
const { protect } = require('../middleware/auth');
const { createListing, getListingsByCategory, getListingById } = require('../controllers/listingController');

const router = express.Router();

router.post('/create', protect, createListing);
router.get('/:category', getListingsByCategory);  // Public, but tracks if auth
router.get('/:id', getListingById);  // Public

module.exports = router;