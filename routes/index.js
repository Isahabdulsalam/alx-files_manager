import { Router } from 'express';
const express = require('express');
const AppController = require('../controllers/AppController');

const router = Router();

// now we define the API endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

export default router;