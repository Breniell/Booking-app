const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

// Récupérer les avis d'un service
router.get('/:id/reviews', authenticate, reviewController.getReviews);
// Poster un avis pour un service
router.post('/:id/reviews', authenticate, reviewController.createReview);

module.exports = router;
