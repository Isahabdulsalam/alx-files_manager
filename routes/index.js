const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

// now we define the API endpoints
router.get('/status', AppController.getStatus);
router.get('/status', AppController.getStats);

module.export = router;