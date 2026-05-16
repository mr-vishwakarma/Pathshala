const LearningEntry = require("../models/learningEntry.model");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalEntries = await LearningEntry.countDocuments({ user: userId });

    const recentEntries = await LearningEntry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalStudyHoursResult = await LearningEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$studyDuration" },
        },
      },
    ]);

    const totalStudyHours = totalStudyHoursResult[0]?.totalHours || 0;

    const difficultyStats = await LearningEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$difficultyLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const weeklyStudyStats = await LearningEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalHours: { $sum: "$studyDuration" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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
