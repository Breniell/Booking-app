// controllers/expertStatsController.js
const db = require('../models');

exports.getRevenueForExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;
    const appointments = await db.Appointment.findAll({
      where: { expertId, status: 'completed' },
      include: [{
        model: db.Service,
        as: 'service', // Ajout de l'alias pour respecter l'association
        attributes: ['price'],
        required: false
      }]
    });
    const totalRevenue = appointments.reduce((sum, app) => {
      return sum + (app.service ? parseFloat(app.service.price) : 0);
    }, 0);
    return res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    return res.status(500).json({ message: 'Error calculating revenue', error: error.message });
  }
};


exports.getClientsForExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;
    const appointments = await db.Appointment.findAll({
      where: { expertId },
      attributes: ['clientId']
    });
    const uniqueClients = new Set(appointments.map(app => app.clientId));
    return res.status(200).json({ totalClients: uniqueClients.size });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};
