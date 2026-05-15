const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { send } = require('process');

const registerUser = async(req, res) => {
    try {
        const {fullname, email, password} = req.body; 

        const existingUser = await User.findOne({ 
            email,
        })

        if(existingUser) {
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationTken = crypto.randomBytes(32).toString("hex");


        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            verificationTken,
        });

        const verificationURL = `http://localhost:5000/api/verify-email/${verificationToken}`;
        await sendEmail(
          email,
          "Verify Your email",
          `"Click this link to verify your email:${verifationURL}"`
        )
        res.status(201).json({
            message:"User created Sucessfully",
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutUser = async(req, res) => {
    try {
        res.clearCookie("token");

        res.status(200).json({
            message:"logout successfully"
        });
        
    } catch (error) {
            res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {registerUser, loginUser, logoutUser,};