import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, getUserById, getAvailableUsers } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/users', getAvailableUsers); // Get all available users for switcher
router.get('/user/:userId', getUserById); // Get specific user by ID

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;