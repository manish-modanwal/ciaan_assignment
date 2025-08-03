// backend/src/routes/auth.js

const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getLoggedInUser
} = require('../controllers/authController');
const auth = require('../middleware/auth'); 


router.post('/register', registerUser);


router.post('/login', loginUser);


router.get('/', auth, getLoggedInUser);

module.exports = router;