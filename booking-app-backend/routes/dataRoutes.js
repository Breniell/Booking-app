// routes/dataRoutes.js
const express = require("express");
const router = express.Router();
const { exportUserData, deleteUserData } = require("../controllers/dataController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get('/export', authenticate, exportUserData);
router.delete('/delete', authenticate, deleteUserData);

module.exports = router;
