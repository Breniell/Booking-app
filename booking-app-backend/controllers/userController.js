// controllers/userController.js
const db = require('../models');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const logger = require('../utils/logger');
require('dotenv').config();

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expires in 1 hour
  });
};

// Register a new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {  
    const user = await db.User.create(req.body);
    
    if (user.role === 'expert') {
      await db.Expert.create({ userId: user.id });
    }

    const token = generateToken(user);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }  
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {

    // Find the user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is valid
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);

    res.status(200).json({ 
      message: 'Logged in successfully', 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

//Get all users (ADMIN ONLY - add middleware for authorization)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retrieving users', error: error.message});
  }
};

