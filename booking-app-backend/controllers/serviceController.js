// controllers/serviceController.js
const db = require('../models');
const path = require('path');
const { Op } = require('sequelize');

exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price, videoPlatform, availability } = req.body;

    // Vérifier que l'utilisateur est un expert
    if (req.user.role !== 'expert') {
      return res.status(403).json({ message: 'Unauthorized: Only experts can create services' });
    }

    // Récupérer le profil expert
    const expert = await db.Expert.findOne({ where: { userId: req.user.id } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    // Récupérer le chemin de l'image téléchargée
    const imagePath = req.file ? path.join('uploads', req.file.filename) : 'assets/default-service.jpg';

    // Créer le service
    const service = await db.Service.create({
      expertId: expert.id,
      name,
      description,
      duration,
      price,
      videoPlatform,
      imageUrl: imagePath  // On stocke le chemin de l'image
    });

    // Traitement des disponibilités
    if (availability) {
      let availabilityArray;
      try {
        availabilityArray = JSON.parse(availability);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid availability format', error: err.message });
      }

      const availabilityData = availabilityArray.map(slot => ({
        expertId: expert.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        recurring: false
      }));
      await db.Availability.bulkCreate(availabilityData);
    }

    return res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// Get all services with optional search (et autres filtres éventuels)
exports.getAllServices = async (req, res) => {
  try {
    const { search, category, rating } = req.query;
    const filters = {};
    if (search) {
      filters.name = { [Op.like]: `%${search}%` };
    }
    // Possibilité d'ajouter d'autres filtres
    const services = await db.Service.findAll({ where: filters });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving services', error: error.message });
  }
};

// Get all services by an expert with tri (via query param "sort")
exports.getServicesByExpert = async (req, res) => {
  try {
    const expertId = parseInt(req.params.expertId, 10);
    const { sort } = req.query;
    let order = [];
    if (sort) {
      switch (sort) {
        case 'price-asc':
          order.push(['price', 'ASC']);
          break;
        case 'price-desc':
          order.push(['price', 'DESC']);
          break;
        case 'duration-asc':
          order.push(['duration', 'ASC']);
          break;
        case 'duration-desc':
          order.push(['duration', 'DESC']);
          break;
        default:
          break;
      }
    }
    const services = await db.Service.findAll({ 
      where: { expertId },
      include: [{
        model: db.Expert,
        include: [{
          model: db.User,
          as: 'User'
        }]
      }],
      order
    });

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get a service by ID
exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id, {
      include: [{
        model: db.Expert,
        include: [{
          model: db.User,
          as: 'User',
          attributes: ['firstName', 'lastName']
        }]
      }]
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Si l'image est stockée en chemin relatif, construire une URL absolue.
    if (service.imageUrl && !service.imageUrl.startsWith('http')) {
      const normalizedPath = service.imageUrl.replace(/\\/g, '/');
      service.imageUrl = `${req.protocol}://${req.get('host')}/${normalizedPath}`;
    }
    
    return res.status(200).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving service', error: error.message });
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

    return res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// Delete a service (Expert Only)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const expert = await db.Expert.findOne({ where: { userId: req.user.id } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    if (service.expertId !== expert.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own services' });
    }

    await service.destroy();
    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};
