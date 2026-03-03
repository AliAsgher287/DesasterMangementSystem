const express = require('express');
const { register, login, forgotPassword, verifyResetOTP, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyresetotp', verifyResetOTP);
router.put('/resetpassword', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
