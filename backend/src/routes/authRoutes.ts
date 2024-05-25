import express from 'express';
import { register, login, getUserProfile } from '../controllers/authController.js';
import { check } from 'express-validator';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

router.get('/profile', auth, getUserProfile);

export default router;
