const FocusSession = require("../models/focusSession.model");
const LearningEntry = require("../models/learningEntry.model");

const startFocusSession = async (req, res) => {
  try {
    const { topicName, duration } = req.body;

    if (!topicName || !duration) {
      return res.status(400).json({
        message: "Topic name and duration are required",
      });
    }

    const session = await FocusSession.create({
      topicName,
      duration,
      status: "active",
      completed: false,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Focus session started",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const completeFocusSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, difficultyLevel } = req.body;

    const session = await FocusSession.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Focus session not found",
      });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to complete this session",
      });
    }

    session.completed = true;
    session.status = "completed";
    await session.save();

    // Automatically create a learning entry based on completed focus session
    const studyHours = parseFloat((session.duration / 60).toFixed(2));
    const entryDescription = description || `Successfully completed focus session on ${session.topicName}`;
    const level = difficultyLevel || "Medium";

    const entry = await LearningEntry.create({
      topicName: session.topicName,
      description: entryDescription,
      studyDuration: studyHours,
      difficultyLevel: level,
      user: req.user._id,
    });

    res.status(200).json({
      message: "Focus session completed and logged in journal",
      session,
      entry,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFocusStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get today's start and end bounds (local times)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get yesterday's bounds
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    // Fetch sessions
    const completedSessions = await FocusSession.find({
      user: userId,
      status: "completed",
    });

    // 1. Calculate today's focus minutes
    let todayMinutes = 0;
    completedSessions.forEach((s) => {
      const sDate = new Date(s.updatedAt);
      if (sDate >= todayStart && sDate <= todayEnd) {
        todayMinutes += s.duration;
      }
    });

    // 2. Calculate yesterday's focus minutes
    let yesterdayMinutes = 0;
    completedSessions.forEach((s) => {
      const sDate = new Date(s.updatedAt);
      if (sDate >= yesterdayStart && sDate <= yesterdayEnd) {
        yesterdayMinutes += s.duration;
      }
    });

    // 3. Calculate streak (consecutive days with completed focus sessions)
    // Group all completed dates in local time
    const completedDatesSet = new Set();
    completedSessions.forEach((s) => {
      const dateStr = new Date(s.updatedAt).toDateString();
      completedDatesSet.add(dateStr);
    });

    let streak = 0;
    let checkDate = new Date(todayStart);

    // If no completed session today, check if there was one yesterday to preserve streak
    if (!completedDatesSet.has(checkDate.toDateString())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (completedDatesSet.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    res.status(200).json({
      todayHours: parseFloat((todayMinutes / 60).toFixed(1)),
      todayMinutes: todayMinutes,
      yesterdayHours: parseFloat((yesterdayMinutes / 60).toFixed(1)),
      streak,
      dailyGoalHours: 3.0, // default goal matching mockup
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  startFocusSession,
  completeFocusSession,
  getFocusStats,
};
