// routes/flutterwaveRoutes.js
const express = require('express');
const router = express.Router();
const flutterwaveController = require('../controllers/flutterwaveController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize a Flutterwave payment
router.post('/', authenticate, flutterwaveController.initializePayment);

// Handle redirection after payment
router.get('/redirect', flutterwaveController.handleRedirect);

module.exports = router;
