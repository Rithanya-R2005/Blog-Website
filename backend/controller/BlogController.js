const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require('cookie-parser');
const Blog = require("../models/BlogSchema.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const User = require("../models/UserSchema");


const addBlog = async(req,res)=>{
    const authorId = req.user._id;
    const {title,description} = req.body;
    const blog = new Blog({authorId,title,description});
    await blog.save();
    res.json({
    message: "Blog added successfully"
  });
};

const getBlog = async(req,res)=>{
  try{
    const blog = await Blog.find();
    res.json(blog);
  }
  catch{
    res.json({message:"Failed to fetch blogs.."});
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("authorId", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

const likeBlog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if already liked
    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    blog.likes.push(userId);
    await blog.save();

    res.json({
      message: "Blog liked",
      likesCount: blog.likes.length
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to like blog" });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      userId: req.user._id,   
      text: commentText,
      createdAt: new Date(),
    });

    await blog.save();

    res.json({
      message: "Comment added successfully",
      comments: blog.comments,
    });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};


const saveBlog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already saved?
    if (user.savedBlogs.includes(blogId)) {
      return res.status(400).json({ message: "Blog already saved" });
    }

    user.savedBlogs.push(blogId);
    await user.save();

    res.json({ message: "Blog saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // OWNER CHECK
    if (blog.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};


module.exports = {
    addBlog,
    getBlog,
    getSingleBlog,
    likeBlog,
    addComment,
    saveBlog,
    deleteBlog
};
