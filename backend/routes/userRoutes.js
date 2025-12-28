const express=require('express');
const {registerController,loginController,logoutController,authController,saveBlogController,getDashboard} =require("../controller/UserController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/UserSchema");

router.post("/register",registerController);
router.post("/login",loginController);
router.post("/logout",logoutController);
//router.get("/me",authController);
// router.get("/me", authMiddleware, (req, res) => {
//   res.json({
//     isAuth: true,
//     user: req.user,
//   });
// });
router.post("/save/:blogId", authMiddleware, saveBlogController);
router.get("/me", authMiddleware, authController);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports= router;