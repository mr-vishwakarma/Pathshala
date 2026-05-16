const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const upload = require("../utils/multer");

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto,
} = require("../controllers/profile.controller");

router.get("/me", authMiddleware, getProfile);

router.put("/update", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("image"),
  uploadProfilePhoto,
);

module.exports = router;
