const LearningEntry = require("../models/learningEntry.model");

const addLearningEntry = async (req, res) => {
  try {
    const { topicName, description, studyDuration, difficultyLevel } = req.body;

    if (!topicName || !description || !studyDuration || !difficultyLevel) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const entry = await LearningEntry.create({
      topicName,
      description,
      studyDuration,
      difficultyLevel,

      user: req.user._id,
    });

    res.status(201).json({
      message: "Learning entry added successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllEntries = async (req, res) => {
  try {
    const entries = await LearningEntry.find()

      .populate("user", "fullname email")

      .sort({
        createdAt: -1,
      });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleEntry = async (req, res) => {
  try {
    const entry = await LearningEntry.findById(req.params.id).populate(
      "user",
      "fullname email",
    );

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const editEntry = async (req, res) => {
  try {
    const entry = await LearningEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to edit",
      });
    }

    const updatedEntry = await LearningEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "Entry updated successfully",
      updatedEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await LearningEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete",
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      message: "Entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchEntries = async (req, res) => {
  try {
    const { topic, difficulty, startDate, endDate } = req.query;

    const query = {
      user: req.user._id,
    };

    if (topic) {
      query.topicName = {
        $regex: topic,
        $options: "i",
      };
    }

    if (difficulty) {
      query.difficultyLevel = difficulty;
    }

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const entries = await LearningEntry.find(query)
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addLearningEntry,
  getAllEntries,
  getSingleEntry,
  editEntry,
  deleteEntry,
  searchEntries,
};
