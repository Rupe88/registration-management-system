const User = require("../model/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const bcrypt=require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt=require("jsonwebtoken");
require("dotenv").config();

//nodemailer config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

// Register Controller
const registerUser=catchAsyncError(async(req, res)=>{
    const {username, email, password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            success:false,
            message:"please provide username, email and password"
        })
    }
    try {
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"user already exists"
            })
        }

        const user=new User({
            username,
            email,
            password
        });
        await user.save();

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error in register user api",
        })
        
    }
});


//Login controller
const loginUser=catchAsyncError(async(req, res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"please provide email and password"
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"invalid credentials"
            })
        }

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"1h"
        });

        return res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } })
        
    } catch (error) {
        console.log(error)
       return res.status(500).json({ message: 'Server error, error in login user api' })

    }
});

//getAll Users
const getAllUsers=catchAsyncError(async(req, res)=>{
    try {
        const users=await User.find().select("-password");
        return res.status(200).json({
            success:true,
            message:"all user fetch successfully",
            users
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({

            success:false,
            message:"error in get all users api"
        })
        
    }
})


//get single user
const getSingleUser=catchAsyncError(async(req, res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found"
            });
          }
          res.status(200).json({
            success: true,
            message:"single user data fetched successfully!",
            user
          });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error in get single user api"
        })
        
    }
})


//update user 
const updateUser = catchAsyncError(async (req, res) => {
    const { username, email } = req.body;
    const {id}=req.params;
    const user = await User.findByIdAndUpdate(id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
   return  res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });
  });

//delete user
  const deleteUser = catchAsyncError(async (req, res) => {
    const {id}=req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
   return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  });

  const requestPasswordReset = catchAsyncError(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
  
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link to reset your password: \n\n ${resetUrl}`;
    
    try {
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        text: message
      });
      
      res.status(200).json({
        success: true,
        message: "Password reset email sent"
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: "Email could not be sent"
      });
    }
  });
  
  // Reset Password
  const resetPassword = catchAsyncError(async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired"
      });
    }
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

    })
  


module.exports={
    registerUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    resetPassword,
    requestPasswordReset,

}