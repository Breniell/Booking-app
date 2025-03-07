// controllers/expertController.js
const db = require('../models');
const { authenticate } = require('../middleware/authMiddleware');

// Create an expert profile
exports.createExpertProfile = async (req, res) => {
  try {
    const { userId, bio, expertise } = req.body;

    // Check if the user already has an expert profile
    const existingExpert = await db.Expert.findOne({ where: { userId } });
    if (existingExpert) {
      return res.status(400).json({ message: 'Expert profile already exists for this user' });
    }

    const expert = await db.Expert.create({
      userId,
      bio,
      expertise
    });

    res.status(201).json({ message: 'Expert profile created successfully', expert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating expert profile', error: error.message });
  }
};

// Get an expert profile by user ID
exports.getExpertProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await db.Expert.findOne({
      where: { userId },
      include: [{ model: db.User, attributes: ['firstName', 'lastName', 'email'] }] //Include user info
    });

    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    res.status(200).json(expert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving expert profile', error: error.message });
  }
};

// Update an expert profile
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

    res.status(200).json({ message: 'Expert profile updated successfully', expert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating expert profile', error: error.message });
  }
};

exports.getExpertRevenue = async (req, res) => {
  try {
      const { userId } = req.params;
      const expert = await db.Expert.findOne({ where: { userId } });

      if (!expert) {
          return res.status(404).json({ message: 'Expert not found' });
      }

      // Supposons que tu as une table `Payments` liée aux experts pour stocker leurs revenus
      const totalRevenue = await db.Payment.sum('amount', { where: { expertId: expert.id } });

      res.status(200).json({ revenue: totalRevenue || 0 });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving expert revenue', error: error.message });
  }
};


// Delete an expert profile
exports.deleteExpertProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await db.Expert.findOne({ where: { userId } });

    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    await expert.destroy();

    res.status(200).json({ message: 'Expert profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting expert profile', error: error.message });
  }
};
