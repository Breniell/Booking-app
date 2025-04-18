// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Create a new appointment
router.post(
    '/',
    authenticate,
    [
      body('serviceId').isInt().withMessage('serviceId doit être un nombre entier'),
      body('startTime').isISO8601().withMessage('startTime doit être une date valide'),
      body('endTime').isISO8601().withMessage('endTime doit être une date valide')
    ],
    appointmentController.createAppointment
  );

router.post('/multi', authenticate, appointmentController.createMultiAppointment);


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
