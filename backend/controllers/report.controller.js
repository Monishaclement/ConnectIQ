const Report = require("../models/Report");
const User = require("../models/User");

const reportUser = async (req, res) => {
  try {
    const reportedBy = req.user.id;

    const {
      reportedUserId,
      reason,
      description,
    } = req.body;

    if (reportedBy === reportedUserId) {
      return res.status(400).json({
        message: "Cannot report yourself",
      });
    }

    // Save report
    await Report.create({
      reportedUser: reportedUserId,
      reportedBy,
      reason,
      description,
    });

    // Update scores
    const user = await User.findById(reportedUserId);

    if (user) {
      user.riskScore += 10;
      user.trustScore -= 5;

      if (user.riskScore > 100) {
        user.riskScore = 100;
      }

      if (user.trustScore < 0) {
        user.trustScore = 0;
      }

      await user.save();
    }

    res.status(200).json({
      message: "User reported successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  reportUser,
};