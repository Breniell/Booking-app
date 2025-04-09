// controllers/availabilityController.js
const db = require('../models');
const { format } = require('date-fns-tz');

// Récupérer les disponibilités d’un expert (optionnel : filtrer par mois)
exports.getAvailabilityByExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { month, serviceId } = req.query; // format "YYYY-MM"
    const whereClause = { expertId };

     // Récupérer la durée du service si disponible
     let serviceDuration = 30; // Valeur par défaut
     if (serviceId) {
       const service = await db.Service.findByPk(serviceId);
       if (service) serviceDuration = service.duration;
     }

    if (month) {
      whereClause.date = {
        [db.Sequelize.Op.like]: `${month}%`
      };
    }

    // On récupère les disponibilités telles qu'elles sont enregistrées (avec startTime/endTime)
    const availabilities = await db.Availability.findAll({ where: whereClause, raw: true });
    // Transformation : regrouper par date et générer un tableau "slots"
     // Nouvelle logique de génération des créneaux
    const grouped = {};
    availabilities.forEach(av => {
      if (!grouped[av.date]) grouped[av.date] = { date: av.date, slots: [] };
      
      const start = new Date(`${av.date}T${av.startTime}Z`);
      const end = new Date(`${av.date}T${av.endTime}Z`);
      
      // Générer les créneaux toutes les X minutes (selon la durée du service)
      let currentTime = start;
      while (currentTime < end) {
        const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);
        if (slotEnd > end) break;
        
        const formattedSlot = format(currentTime, 'HH:mm', {timeZone: 'UTC'});
        grouped[av.date].slots.push(formattedSlot);
        
        currentTime = slotEnd; // Passer au prochain créneau
      }
    });

    const result = Object.values(grouped);
    console.log("Disponibilités renvoyées :", result);
    res.status(200).json(result);
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

    console.log("Disponibilités reçues :", availabilities); 


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
