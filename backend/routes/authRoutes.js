import express from 'express';
import passport from 'passport';
import {
  signup, login, forgotPassword, verifyOTPAndReset, googleCallback
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp-reset', verifyOTPAndReset);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), googleCallback);


export default router;
