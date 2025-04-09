const db = require('../models');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  console.log('Requête de recherche reçue :', req.query.query);
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'La requête de recherche est manquante.' });
  }
  try {
    const users = await db.User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    const services = await db.Service.findAll({
      where: {
        name: { 
          [Op.like]: `%${query}%` }
      },
      attributes: ['id', 'name', 'description']
    });

    const formattedResults = [
      ...users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        type: 'expert'
      })),
      ...services.map(service => ({
        id: service.id,
        name: service.name,
        type: 'service'
      }))
    ];

    return res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Erreur dans la recherche:', error);
    return res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
};
