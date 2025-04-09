// controllers/clientController.js
const db = require('../models');

// Récupérer le profil client (on considère ici que les clients sont des utilisateurs avec le rôle 'client')
exports.getClientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.User.findOne({ where: { id, role: 'client' } });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving client profile', error: error.message });
  }
};

// Mettre à jour le profil client
exports.updateClientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.User.findOne({ where: { id, role: 'client' } });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    // Mettez à jour les champs autorisés
    const { firstName, lastName, phone } = req.body;
    if (firstName !== undefined) client.firstName = firstName;
    if (lastName !== undefined) client.lastName = lastName;
    if (phone !== undefined) client.phone = phone;
    
    await client.save();
    return res.status(200).json({ message: 'Client profile updated successfully', client });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating client profile', error: error.message });
  }
};
