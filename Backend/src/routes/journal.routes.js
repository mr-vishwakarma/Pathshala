const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {addLearningEntry,} = require("../controllers/journal.controller");

router.post("/add",authMiddleware,addLearningEntry);

module.exports = router;