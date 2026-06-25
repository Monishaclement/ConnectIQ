const User = require("../models/User");
const Connection = require("../models/Connection");

const {
  calculateMatchScore,
} = require("../services/match.service");

const getRecommendations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);

    const users = await User.find({
      _id: { $ne: currentUserId },
    });

    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { receiver: currentUserId },
      ],
    });

    const connectedIds = new Set();

    connections.forEach((connection) => {
      connectedIds.add(connection.requester.toString());
      connectedIds.add(connection.receiver.toString());
    });

    const scoredUsers = [];

    for (let user of users) {
      if (connectedIds.has(user._id.toString())) continue;

      const score = await calculateMatchScore(
        currentUser,
        user
      );

      scoredUsers.push({
        user,
        score,
      });
    }

    scoredUsers.sort((a, b) => b.score - a.score);

    res.status(200).json(
      scoredUsers.slice(0, 10)
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getRecommendations,
};