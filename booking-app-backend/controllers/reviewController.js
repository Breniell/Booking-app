const db = require('../models');

// Récupérer les avis d’un service
exports.getReviews = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const reviews = await db.Review.findAll({
      where: { serviceId },
      include: [{
        model: db.User,
        attributes: ['firstName', 'lastName', 'avatar']
      }]
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des avis', error: error.message });
  }
};

// Créer un avis pour un service
// controllers/reviewController.js
exports.createReview = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { rating, comment } = req.body;
    // Création de l'avis
    const review = await db.Review.create({
      serviceId,
      userId: req.user.id,  // supposant que req.user est défini via l'authentification
      rating,
      comment
    });
    // Récupération des informations de l'utilisateur associé
    const user = await db.User.findByPk(req.user.id, { 
      attributes: ['firstName', 'lastName', 'avatar'] 
    });
    res.status(201).json({ review: { ...review.toJSON(), user }, message: 'Avis créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l’avis', error: error.message });
  }
};

