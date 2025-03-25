// controllers/dashboardController.js
const db = require('../models');

exports.getDashboardForExpert = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'expert') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const upcomingAppointments = await db.Appointment.findAll({
      where: {
        expertId: req.user.id,
        startTime: { [db.Sequelize.Op.gt]: new Date() }
      },
      order: [['startTime', 'ASC']],
      include: [
        { model: db.Service, as: 'service', attributes: ['name', 'price'] },
        { model: db.User, as: 'Client', attributes: ['firstName', 'lastName'] }
      ]
    });
    // Exemple simple de calcul de revenu total (à affiner)
    const completedAppointments = await db.Appointment.findAll({
      where: { expertId: req.user.id, status: 'completed' },
      include: [{ model: db.Service, as: 'service', attributes: ['price'] }]
    });
    const totalRevenue = completedAppointments.reduce((sum, app) => {
      return sum + (app.service ? parseFloat(app.service.price) : 0);
    }, 0);
    return res.status(200).json({ upcomingAppointments, totalRevenue });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Error retrieving dashboard data', error: error.message });
  }
};

exports.getDashboardForClient = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const upcomingAppointments = await db.Appointment.findAll({
      where: {
        clientId: req.user.id,
        startTime: { [db.Sequelize.Op.gt]: new Date() }
      },
      order: [['startTime', 'ASC']],
      include: [
        { model: db.Service, as: 'service', attributes: ['name'] },
        { model: db.User, as: 'Expert', attributes: ['firstName', 'lastName'] }
      ]
    });
    return res.status(200).json({ upcomingAppointments });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Error retrieving dashboard data', error: error.message });
  }
};
