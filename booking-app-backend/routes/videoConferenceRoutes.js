// routes/videoConferenceRoutes.js
const express = require('express');
const router = express.Router();
const videoConferenceController = require('../controllers/videoConferenceController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a Zoom meeting
router.post('/zoom', authenticate, videoConferenceController.createZoomMeeting);

// Create a Google Meet meeting
router.post('/googlemeet', authenticate, videoConferenceController.createGoogleMeet);

module.exports = router;
