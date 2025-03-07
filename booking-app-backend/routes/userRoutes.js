// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware'); //Example

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

//Get all users (ADMIN ONLY) - Example of protected route
router.get('/all', authenticate, userController.getAllUsers);

module.exports = router;
