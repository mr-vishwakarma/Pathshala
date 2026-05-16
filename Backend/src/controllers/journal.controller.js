const LearningEntry = require("../models/learningEntry.model");

const addLearningEntry = async (req,res) => {
  try {
    const {
      topicName,
      description,
      studyDuration,
      difficultyLevel,
    } = req.body;

    const entry =
      await LearningEntry.create({
        topicName,
        description,
        studyDuration,
        difficultyLevel,

        user: req.user._id,
      });

    res.status(201).json({
      message:"Learning entry added successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addLearningEntry,
};