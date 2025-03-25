// controllers/dataController.js
const db = require('../models');

exports.exportUserData = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const user = await db.User.findByPk(req.user.id, { include: [{ all: true, nested: true }] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ message: 'Error exporting user data', error: error.message });
  }
};

exports.deleteUserData = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    await db.User.destroy({ where: { id: req.user.id } });
    return res.status(200).json({ message: 'User data deleted successfully' });
  } catch (error) {
    console.error('Delete data error:', error);
    return res.status(500).json({ message: 'Error deleting user data', error: error.message });
  }
};
