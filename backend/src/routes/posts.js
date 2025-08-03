const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    search 
} = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, createPost);
router.get('/', getAllPosts);
router.delete('/:id', auth, deletePost);
router.put('/like/:id', auth, likePost);
router.post('/comment/:id', auth, addComment);
router.delete('/comment/:post_id/:comment_id', auth, deleteComment);
router.get('/search', search);

module.exports = router;