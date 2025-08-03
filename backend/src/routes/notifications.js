const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationsController');

router.get('/', auth, getNotifications);


router.put('/read/:id', auth, markAsRead);

module.exports = router;