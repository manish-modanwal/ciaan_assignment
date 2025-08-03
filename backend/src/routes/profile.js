

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');


router.get('/me', auth, profileController.getMyProfile);


router.get('/:user_id', auth, profileController.getUserProfile);


router.put('/me', auth, profileController.updateMyProfile);


router.put('/follow/:id', auth, profileController.followUser);


router.put('/unfollow/:id', auth, profileController.unfollowUser);

module.exports = router;