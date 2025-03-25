const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, searchController.search);

module.exports = router;
