const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

router.get("/me", authMiddleware, getProfile);

router.put("/update", authMiddleware, updateProfile);

module.exports = router;
