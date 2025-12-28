const express = require('express');
const router = express.Router();
const {addBlog,getBlog,getSingleBlog, likeBlog, addComment,saveBlog,deleteBlog} = require('../controller/BlogController');
const authMiddleware= require('../middleware/authMiddleware');

router.post('/addblog',authMiddleware,addBlog);
router.get('/getblog',getBlog);
router.get('/getblog/:id',getSingleBlog);
router.post("/like/:id",authMiddleware,likeBlog);
router.post('/comment/:id', authMiddleware,addComment);
router.post("/save/:id", authMiddleware, saveBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);

module.exports = router;