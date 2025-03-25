const db = require('../models');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'La requête de recherche est manquante.' });
  }
  try {
    const users = await db.User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    const services = await db.Service.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      attributes: ['id', 'name', 'description']
    });

    return res.status(200).json({ users, services });
  } catch (error) {
    console.error('Erreur dans la recherche:', error);
    return res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
};
