const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const User =require( "../models/UserSchema.js");
const authMiddleware =require( "../middleware/authMiddleware.js");
const Blog = require("../models/BlogSchema");

const registerController=async (req, res) => {
  const { name, email, password } = req.body;

  console.log({ name, email, password });
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({
    message: "User registered successfully"
  });
};

const loginController=async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials"});
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({
    message: "Login successful"
  });
};

const logoutController=(req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// const getSavedBlogs = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//       .populate("savedBlogs");

//     res.json(user.savedBlogs);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch saved blogs" });
//   }
// };

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // USER BASIC INFO
    const user = await User.findById(userId).select("name email savedBlogs");

    // STATS
    const postsCount = await Blog.countDocuments({ authorId: userId });
    const likesCount = await Blog.countDocuments({ likes: userId });
    const savedCount = user.savedBlogs.length;

    // SAVED BLOGS
    const savedBlogs = await Blog.find({
      _id: { $in: user.savedBlogs },
    }).sort({ createdAt: -1 });

    // 🔥 MY BLOGS (THIS WAS MISSING)
    const myBlogs = await Blog.find({ authorId: userId }).sort({
      createdAt: -1,
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      stats: {
        postsCount,
        likesCount,
        savedCount,
      },
      savedBlogs,
      myBlogs, // ✅ NOW FRONTEND WILL RECEIVE IT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};


const saveBlogController = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.blogId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedBlogs.includes(blogId);

    if (alreadySaved) {
      // UNSAVE
      user.savedBlogs.pull(blogId);
    } else {
      // SAVE
      user.savedBlogs.push(blogId);
    }

    await user.save();

    res.json({
      saved: !alreadySaved,
      savedBlogs: user.savedBlogs,
    });
  } catch (err) {
    console.error("Save blog error:", err);
    res.status(500).json({ message: "Failed to save blog" });
  }
};



// const authController=(authMiddleware, async (req, res) => {
//   const user = await User.findById(req.user.userId).select("-password");

//   res.json({
//     user
//   });
// });

const authController=(authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("name email savedBlogs");

  res.json({
    user
  });
});



module.exports= {registerController,loginController,logoutController,authController,saveBlogController,getDashboard};

