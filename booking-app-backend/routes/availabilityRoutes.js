// routes/availabilityRoutes.js
const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/:expertId', authenticate, availabilityController.getAvailabilityByExpert);
router.put('/:expertId', authenticate, availabilityController.updateAvailability);

module.exports = router;
