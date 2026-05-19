const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const getBackendURL = (req) =>
  process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const isVerified = process.env.NODE_ENV !== "production";

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified,
    });
    const verificationURL = `${getBackendURL(req)}/api/auth/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      "Verify Your email",
      `"Click this link to verify your email:${verificationURL}"`,
    );
    res.status(201).json({
      message: isVerified
        ? "User registered successfully. You can now log in."
        : "User registered successfully. Please verify your email before logging in.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify you email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

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
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

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

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL = `${getBackendURL(req)}/api/auth/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Password",
      `Reset your password using this link: ${resetURL}`,
    );

    res.status(200).json({
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.send("Invalid or Expired Token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpires = undefined;

    await user.save();

    res.send("Password Reset Successful");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
