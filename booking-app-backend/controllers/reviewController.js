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
exports.createReview = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { rating, comment } = req.body;
    // Vous pouvez ajouter ici une validation supplémentaire
    const review = await db.Review.create({
      serviceId,
      userId: req.user.id,  // supposant que req.user est disponible grâce à l'authentification
      rating,
      comment
    });
    res.status(201).json({ review, message: 'Avis créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l’avis', error: error.message });
  }
};
