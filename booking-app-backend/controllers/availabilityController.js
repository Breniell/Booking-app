// controllers/availabilityController.js
const db = require('../models');

// Récupérer les disponibilités d’un expert (optionnel : filtrer par mois)
exports.getAvailabilityByExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { month } = req.query; // Optionnel : filtre par mois (format "YYYY-MM")
    let whereClause = { expertId };

    if (month) {
      whereClause.date = {
        [db.Sequelize.Op.like]: `${month}%`
      };
    }

    const availabilities = await db.Availability.findAll({ where: whereClause });
    res.status(200).json(availabilities);
  } catch (error) {
    console.error("Error fetching availabilities:", error);
    res.status(500).json({ message: 'Error fetching availabilities', error: error.message });
  }
};

// Mettre à jour (ou remplacer) les disponibilités pour un expert
exports.updateAvailability = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { availabilities } = req.body; // Attend un tableau d'objets { date, startTime, endTime }
    // Supprimer les disponibilités existantes pour l'expert
    await db.Availability.destroy({ where: { expertId } });
    // Créer les nouvelles disponibilités
    const createdAvailabilities = await db.Availability.bulkCreate(
      availabilities.map(av => ({
        expertId,
        date: av.date,
        startTime: av.startTime,
        endTime: av.endTime,
        recurring: av.recurring || false
      }))
    );
    res.status(200).json(createdAvailabilities);
  } catch (error) {
    console.error("Error updating availabilities:", error);
    res.status(500).json({ message: 'Error updating availabilities', error: error.message });
  }
};
