// routes/orangeMoneyRoutes.js
const express = require('express');
const router = express.Router();
const orangeMoneyController = require('../controllers/orangeMoneyController');
const { authenticate } = require('../middleware/authMiddleware');

// Initialize an Orange Money payment
router.post('/', authenticate, orangeMoneyController.initializePayment);

// Handle notifications from Orange Money API
router.post('/notify', orangeMoneyController.handleNotification);

module.exports = router;
