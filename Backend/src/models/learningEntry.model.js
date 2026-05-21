const mongoose = require("mongoose");

const learningEntrySchema =
  new mongoose.Schema(
    {
      topicName: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      studyDuration: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        enum: ["Coding", "Research", "Writing", "Review", "Problem Solving", "Admin"],
        default: "Coding",
      },

      difficultyLevel: {
        type: String,

        enum: [
          "Easy",
          "Medium",
          "Hard",
        ],

        required: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "LearningEntry",
  learningEntrySchema
);