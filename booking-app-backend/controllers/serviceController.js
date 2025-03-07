// controllers/serviceController.js
const db = require('../models');

exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price, videoPlatform, imageUrl, availability } = req.body;

    // Vérifier que l'utilisateur est un expert
    if (req.user.role !== 'expert') {
      return res.status(403).json({ message: 'Unauthorized: Only experts can create services' });
    }

    // Récupérer le profil expert en fonction de l'ID de l'utilisateur connecté
    const expert = await db.Expert.findOne({ where: { userId: req.user.id } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    // Créer le service
    const service = await db.Service.create({
      expertId: expert.id,
      name,
      description,
      duration, // La durée peut être calculée côté frontend et envoyée (ou recalculée ici)
      price,
      videoPlatform,
      imageUrl
    });

    // Si des disponibilités ont été envoyées, créer les enregistrements correspondants
    if (availability && Array.isArray(availability) && availability.length > 0) {
      const availabilityData = availability.map(slot => ({
        expertId: expert.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        recurring: false // Vous pouvez adapter si besoin
      }));
      await db.Availability.bulkCreate(availabilityData);
    }

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

//Get all the services 

const { Op } = require('sequelize');

exports.getAllServices = async (req, res) => {
  try {
    const { search, category, rating } = req.query;
    const filters = {};
    if (search) {
      filters.name = { [Op.like]: `%${search}%` };
    }
    // if (category) {
    //   filters.category = category;
    // }
    // Vous pouvez également filtrer par note si vous stockez une moyenne dans le modèle Service
    const services = await db.Service.findAll({ where: filters });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving services', error: error.message });
  }
};

  

// Get all services by an expert
exports.getServicesByExpert = async (req, res) => {
  try {
    // Essayer de trouver l'enregistrement Expert correspondant au userId fourni
    let expert = await db.Expert.findOne({ where: { userId: req.params.expertId } });
    
    let services;
    if (!expert) {
      // Si aucun enregistrement Expert n'est trouvé,
      // tenter de récupérer les services en considérant que l'ID de l'expert est égal à l'ID de l'utilisateur.
      services = await db.Service.findAll({ where: { expertId: req.params.expertId } });
    } else {
      services = await db.Service.findAll({ where: { expertId: expert.id } });
    }
    
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get a service by ID
exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id, {
      include: [{
        model: db.Expert,
        // Inclure le modèle User associé à l'expert via l'association définie
        include: [{
          model: db.User,
          as: 'User', // Cet alias doit correspondre à celui défini dans l'association (cf. ci-dessous)
          attributes: ['firstName', 'lastName']
        }]
      }]
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving service', error: error.message });
  }
};


// Update a service (Expert Only)
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration, price } = req.body;

        const service = await db.Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        //Get expertId based on logged in user
        const expert = await db.Expert.findOne({ where: { userId: req.user.id } });

        if (!expert) {
            return res.status(404).json({ message: 'Expert profile not found' });
        }

        if (service.expertId !== expert.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own services' });
        }

        service.name = name;
        service.description = description;
        service.duration = duration;
        service.price = price;
        await service.save();

        res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating service', error: error.message });
    }
};

// Delete a service (Expert Only)
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await db.Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        //Get expertId based on logged in user
        const expert = await db.Expert.findOne({ where: { userId: req.user.id } });

        if (!expert) {
            return res.status(404).json({ message: 'Expert profile not found' });
        }

        if (service.expertId !== expert.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own services' });
        }

        await service.destroy();

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting service', error: error.message });
    }
};
