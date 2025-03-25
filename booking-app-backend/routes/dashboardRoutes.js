// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { getDashboardForExpert, getDashboardForClient } = require("../controllers/dashboardController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get('/expert', authenticate, getDashboardForExpert);
router.get('/client', authenticate, getDashboardForClient);

module.exports = router;
