// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticate } = require('../middleware/authMiddleware');

// Récupérer le profil client
router.get('/:id', authenticate, clientController.getClientProfile);

// Mettre à jour le profil client
router.put('/:id', authenticate, clientController.updateClientProfile);

module.exports = router;
