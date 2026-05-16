const LearningEntry = require("../models/learningEntry.model");

const getDashboardStats = async (req, res) => {
  try {
    const totalEntries = await LearningEntry.countDocuments({
      user: req.user._id,
    });
    const recentEntries = await LearningEntry.find({
      user: req.user._id,
    })

      .sort({
        createdAt: -1,
      })

      .limit(5);

    const totalStudyHours = await LearningEntry.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },

      {
        $group: {
          _id: null,

          totalHours: {
            $sum: "$studyDuration",
          },
        },
      },
    ]);

    res.status(200).json({
      totalEntries,

      totalStudyHours: totalStudyHours[0]?.totalHours || 0,
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
