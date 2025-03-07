// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new appointment
router.post('/', authenticate, appointmentController.createAppointment);

// Get an appointment by ID
router.get('/:id', authenticate, appointmentController.getAppointment);

// Get all appointments for a client
router.get('/client/:clientId', authenticate, appointmentController.getAppointmentsByClient);

// Get all appointments for an expert
router.get('/expert/:expertId', authenticate, appointmentController.getAppointmentsByExpert);

// Update an appointment
router.put('/:id', authenticate, appointmentController.updateAppointment);

// Delete an appointment
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

module.exports = router;
