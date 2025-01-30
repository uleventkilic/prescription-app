const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);  // ❗ Burada `/login` olduğundan emin ol!

module.exports = router;
