// controllers/expertController.js
const db = require('../models');

exports.createExpertProfile = async (req, res) => {
  try {
    const { userId, bio, expertise } = req.body;
    const existingExpert = await db.Expert.findOne({ where: { userId } });
    if (existingExpert) {
      return res.status(400).json({ message: 'Expert profile already exists for this user' });
    }
    const expert = await db.Expert.create({ userId, bio, expertise });
    return res.status(201).json({ message: 'Expert profile created successfully', expert });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating expert profile', error: error.message });
  }
};

exports.getExpertProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const expert = await db.Expert.findOne({
      where: { userId },
      include: [{ association: 'User', attributes: ['firstName', 'lastName', 'email'] }]
    });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    return res.status(200).json(expert);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving expert profile', error: error.message });
  }
};

exports.updateExpertProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, expertise } = req.body;
    const expert = await db.Expert.findOne({ where: { userId } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    expert.bio = bio;
    expert.expertise = expertise;
    await expert.save();
    return res.status(200).json({ message: 'Expert profile updated successfully', expert });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating expert profile', error: error.message });
  }
};

exports.getExpertRevenue = async (req, res) => {
  try {
    const { userId } = req.params;
    const expert = await db.Expert.findOne({ where: { userId } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    const totalRevenue = await db.Payment.sum('amount', { where: { expertId: expert.id } });
    return res.status(200).json({ revenue: totalRevenue || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving expert revenue', error: error.message });
  }
};

exports.getExpertServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const expert = await db.Expert.findOne({ where: { userId } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    const services = await db.Service.findAll({ where: { expertId: expert.id } });
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving expert services', error: error.message });
  }
};

exports.deleteExpertProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const expert = await db.Expert.findOne({ where: { userId } });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    await expert.destroy();
    return res.status(200).json({ message: 'Expert profile deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting expert profile', error: error.message });
  }
};
