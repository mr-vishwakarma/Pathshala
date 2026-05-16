const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addLearningEntry,
  getAllEntries,
  getSingleEntry,
  editEntry,
} = require("../controllers/journal.controller");

router.post("/add", authMiddleware, addLearningEntry);
router.get("/all", authMiddleware, getAllEntries);
router.get("/:id", authMiddleware, getSingleEntry);
router.put("/edit/:id", authMiddleware, editEntry);

module.exports = router;
