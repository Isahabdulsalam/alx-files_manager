import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import UserController from '../controllers/UserController.js';

const router = Router();

// Existing endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

// New endpoint
router.get('/connect', AuthController.getConnect);
router.get('/diconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);

export default router;
