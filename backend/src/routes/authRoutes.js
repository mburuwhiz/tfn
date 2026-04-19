const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
// Protect the register route so only existing admins can create new admins
router.post('/register', protect, registerUser);

module.exports = router;
