// routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new calendar event
router.post('/event', authenticate, calendarController.createEvent);

module.exports = router;
