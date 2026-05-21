const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    category: {
      type: String,
      enum: ["Coding", "Research", "Writing", "Review", "Problem Solving", "Admin"],
      default: "Coding",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
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

// Compound Index for Scalability (500+ users)
focusSessionSchema.index({ user: 1, status: 1, updatedAt: -1 });

module.exports = mongoose.model("FocusSession", focusSessionSchema);
