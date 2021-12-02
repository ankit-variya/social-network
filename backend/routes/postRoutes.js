const express = require('express');
const router = express.Router();
const { createPost, updatePost, listPost, deletePost } = require('../controllers/postAction');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/create', auth, upload.single('post_image'), createPost);
router.put('/update', auth, updatePost);
router.get('/list', listPost);
router.delete('/delete', auth, deletePost);

module.exports = router;

