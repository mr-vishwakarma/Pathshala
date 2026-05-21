const LearningEntry = require("../models/learningEntry.model");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run aggregations concurrently with Promise.all and lean queries to prevent blocking the event loop
    const [
      totalEntries,
      recentEntries,
      totalStudyHoursResult,
      difficultyStats,
      weeklyStudyStats,
      categoryStats,
    ] = await Promise.all([
      LearningEntry.countDocuments({ user: userId }),
      LearningEntry.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(), // Bypasses expensive Mongoose document wrapper hydration class instantiation
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalHours: { $sum: "$studyDuration" },
          },
        },
      ]),
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$difficultyLevel",
            count: { $sum: 1 },
          },
        },
      ]),
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            totalHours: { $sum: "$studyDuration" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: { $ifNull: ["$category", "Coding"] },
            totalHours: { $sum: "$studyDuration" },
          },
        },
      ]),
    ]);

    const totalStudyHours = totalStudyHoursResult[0]?.totalHours || 0;

    let productivityLevel = "Low";
    if (totalStudyHours >= 20) {
      productivityLevel = "High";
    } else if (totalStudyHours >= 10) {
      productivityLevel = "Medium";
    }

    res.status(200).json({
      totalEntries,
      totalStudyHours,
      productivityLevel,
      difficultyStats,
      weeklyStudyStats,
      recentEntries,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
