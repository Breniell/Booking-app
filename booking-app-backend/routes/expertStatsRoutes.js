// routes/expertStatsRoutes.js
const express = require('express');
const router = express.Router();
const { getRevenueForExpert, getClientsForExpert } = require('../controllers/expertStatsController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/:expertId/revenue', authenticate, getRevenueForExpert);
router.get('/:expertId/clients', authenticate, getClientsForExpert);

module.exports = router;
