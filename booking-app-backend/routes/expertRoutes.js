// routes/expertRoutes.js
const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { authenticate } = require('../middleware/authMiddleware');

// Create an expert profile
router.post('/', authenticate, expertController.createExpertProfile);

// Get an expert profile by user ID
router.get('/:userId', authenticate, expertController.getExpertProfile);

router.get('/:userId/services', authenticate, expertController.getExpertServices);

// Update an expert profile
router.put('/:userId', authenticate, expertController.updateExpertProfile);

// Delete an expert profile
router.delete('/:userId', authenticate, expertController.deleteExpertProfile);

module.exports = router;
