const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  startFocusSession,
  completeFocusSession,
  getFocusStats,
} = require("../controllers/focus.controller");

router.post("/start", authMiddleware, startFocusSession);
router.put("/complete/:id", authMiddleware, completeFocusSession);
router.get("/stats", authMiddleware, getFocusStats);

module.exports = router;
