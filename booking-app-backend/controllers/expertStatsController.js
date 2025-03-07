// controllers/expertStatsController.js
const db = require('../models');

// Exemple de calcul du revenu total basé sur les rendez-vous complétés
exports.getRevenueForExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;
    // Récupérer les rendez-vous complétés de cet expert
    const appointments = await db.Appointment.findAll({
      where: { expertId, status: 'completed' },
      include: [{ model: db.Service, attributes: ['price'] }]
    });

    // Calculer la somme des prix (vous pouvez ajuster la logique selon votre modèle)
    const totalRevenue = appointments.reduce((sum, app) => {
      // Assurez-vous que app.Service existe et que le prix est numérique
      return sum + (app.Service ? parseFloat(app.Service.price) : 0);
    }, 0);

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ message: 'Error calculating revenue', error: error.message });
  }
};

// Exemple pour récupérer le nombre de clients uniques pour l'expert
exports.getClientsForExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;
    const appointments = await db.Appointment.findAll({
      where: { expertId },
      attributes: ['clientId']
    });

    // Filtrer les clients uniques
    const uniqueClients = new Set(appointments.map(app => app.clientId));
    res.status(200).json({ totalClients: uniqueClients.size });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};
