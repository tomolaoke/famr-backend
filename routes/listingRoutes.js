// routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const listingController = require('../controllers/listingController');

router.get('/:category', listingController.getListings);
router.post('/', authMiddleware, listingController.createListing);
router.get('/details/:id', listingController.getListingDetails);

module.exports = router;