// controllers/appointmentController.js
const { validationResult } = require('express-validator');
const db = require('../models');
const emailService = require('../utils/emailService');
const videoConferenceController = require('./videoConferenceController');
const { sendNotification } = require('../utils/notificationService');

exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceId, startTime, endTime } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Unauthorized: Only clients can book appointments' });
    }

    const client = await db.User.findByPk(req.user.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const service = await db.Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Vérification des conflits (pour rendez‑vous individuels)
    const conflictingAppointments = await db.Appointment.findAll({
      where: {
        expertId: service.expertId,
        [db.Sequelize.Op.or]: [{
          startTime: { [db.Sequelize.Op.lt]: endTime },
          endTime: { [db.Sequelize.Op.gt]: startTime }
        }]
      }
    });
    if (conflictingAppointments.length > 0) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    let appointment = await db.Appointment.create({
      clientId: req.user.id,
      expertId: service.expertId,
      serviceId,
      startTime,
      endTime,
      status: 'scheduled',
      appointmentType: service.appointmentType || 'consultation'
    });

    // Intégration visioconférence (si applicable)
    if (service.videoPlatform === 'zoom') {
      const zoomData = await videoConferenceController.createZoomMeeting({
        body: { topic: service.name, start_time: startTime }
      });
      appointment.shareableLink = zoomData.joinUrl;
    } else if (service.videoPlatform === 'googleMeet') {
      const meetData = await videoConferenceController.createGoogleMeet({
        body: { summary: service.name, description: service.description, startTime, endTime }
      });
      appointment.shareableLink = meetData.joinUrl;
    }
    await appointment.save();

    // Notifier client et expert
    const expert = await db.User.findByPk(service.expertId);
    const appointmentClient = await db.User.findByPk(req.user.id);
    if (expert && appointmentClient) {
      try {
        await emailService.sendEmail(
          appointmentClient.email,
          'Appointment Confirmation',
          `Your appointment with ${expert.firstName} ${expert.lastName} for ${service.name} is scheduled for ${startTime}.`,
          `<p>Dear ${appointmentClient.firstName},</p><p>Your appointment with ${expert.firstName} ${expert.lastName} for ${service.name} is scheduled for ${startTime}.</p>`
        );
        await emailService.sendEmail(
          expert.email,
          'New Appointment',
          `You have a new appointment with ${appointmentClient.firstName} ${appointmentClient.lastName} scheduled for ${startTime}.`,
          `<p>Dear ${expert.firstName},</p><p>You have a new appointment with ${appointmentClient.firstName} ${appointmentClient.lastName} for ${service.name} scheduled for ${startTime}.</p>`
        );
        // Exemple de notification SMS/email/push
        await sendNotification(appointmentClient, 'Appointment Confirmed', `Your appointment is confirmed for ${startTime}.`, `<p>Your appointment is confirmed for ${startTime}.</p>`);
      } catch (mailError) {
        console.error("Error sending notification:", mailError);
      }
    }

    return res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

exports.createMultiAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({ message: 'Seuls les clients peuvent réserver.' });
    }

    const { basket } = req.body;
    if (!basket || !Array.isArray(basket) || basket.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide.' });
    }

    const createPromises = basket.map(async (item) => {
      const { service, date, time } = item;
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + service.duration * 60000);
      const appointment = await db.Appointment.create({
        clientId: req.user.id,
        expertId: service.expertId,
        serviceId: service.id,
        startTime,
        endTime,
        status: 'scheduled',
        appointmentType: service.appointmentType || 'consultation'
      });
      // Optionnel : déclencher notifications et création d'événement de visioconférence ici
      return appointment;
    });

    const appointments = await Promise.all(createPromises);
    // Vous pouvez envoyer des notifications groupées ici
    return res.status(201).json({ message: 'Rendez-vous créés avec succès', appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la création des rendez-vous', error: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await db.Appointment.findByPk(id, {
      include: [
        { model: db.User, as: 'Client', attributes: ['firstName', 'lastName', 'email'] },
        { model: db.User, as: 'Expert', attributes: ['firstName', 'lastName', 'email'] },
        { model: db.Service, attributes: ['name', 'description', 'duration', 'price'] }
      ]
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving appointment', error: error.message });
  }
};

exports.getAppointmentsByClient = async (req, res) => {
  try {
    if (!req.params.clientId || isNaN(req.params.clientId)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }
    const appointments = await db.Appointment.findAll({
      where: { clientId: req.params.clientId },
      include: [
        { model: db.User, as: 'Expert', attributes: ['firstName', 'lastName', 'email'] },
        { model: db.Service,as: 'service', attributes: ['name', 'price'] }
      ],
      order: [['startTime', 'DESC']]
    });
    const formattedAppointments = appointments.map(app => ({
      ...app.get({ plain: true }),
      startTime: new Date(app.startTime).toISOString(),
      endTime: new Date(app.endTime).toISOString()
    }));
    return res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Backend error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getAppointmentsByExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const appointments = await db.Appointment.findAll({
      where: { expertId },
      include: [
        { model: db.User, as: 'Client', attributes: ['firstName', 'lastName', 'email'] },
        { model: db.Service, as: 'service', attributes: ['name', 'description', 'duration', 'price', 'videoPlatform', 'imageUrl'] }
      ]
    });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'expert') {
      return res.status(403).json({ message: 'Unauthorized: Only experts can update appointments' });
    }
    const { clientId, serviceId, startTime, endTime, status } = req.body;
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.expertId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own appointments' });
    }
    const conflictingAppointments = await db.Appointment.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: id },
        expertId: appointment.expertId,
        [db.Sequelize.Op.or]: [{
          startTime: { [db.Sequelize.Op.lt]: endTime },
          endTime: { [db.Sequelize.Op.gt]: startTime }
        }]
      }
    });
    if (conflictingAppointments.length > 0) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }
    appointment.clientId = clientId;
    appointment.serviceId = serviceId;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = status;
    await appointment.save();
    return res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (req.user.role !== 'expert' || appointment.expertId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your appointments' });
    }
    await appointment.destroy();
    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};
