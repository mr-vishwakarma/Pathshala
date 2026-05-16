const express = require("express");

const router = express.Router();

const {registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword,}= require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, 
    (req, res) =>{
        res.status(200).json(req.user);
    }
);



router.get("/logout", logoutUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password",forgotPassword);

router.get("/reset-password/:token",
  (req, res) => {
    res.render("resetPassword", {
      token: req.params.token,
    });
  }
);

router.post("/reset-password/:token", resetPassword);


module.exports = router;

