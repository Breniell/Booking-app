// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/authMiddleware');

// Route pour créer un service (ajoutée)
router.post('/', authenticate, serviceController.createService);

// Route pour récupérer TOUS les services
router.get('/', authenticate, serviceController.getAllServices);

// Route pour récupérer tous les services d’un expert
router.get('/expert/:expertId', authenticate, serviceController.getServicesByExpert);

// Route pour récupérer un service par ID (doit venir après les routes statiques)
router.get('/:id', authenticate, serviceController.getService);

// Mise à jour d’un service
router.put('/:id', authenticate, serviceController.updateService);

// Suppression d’un service
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;
