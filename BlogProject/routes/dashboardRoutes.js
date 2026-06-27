const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protectRoute } = require('../middleware/setAuthenticated');

router.get('/dashboard', protectRoute, dashboardController.getDashboard);

module.exports = router;
