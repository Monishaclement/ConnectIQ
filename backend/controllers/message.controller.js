const Connection = require("../models/Connection");
const Message = require("../models/Message");

const areConnected = async (userA, userB) => {
  const connection = await Connection.exists({
    status: "accepted",
    $or: [
      { requester: userA, receiver: userB },
      { requester: userB, receiver: userA },
    ],
  });

  return !!connection;
};

const getMessageHistory = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const partnerId = req.params.userId;

    const connected = await areConnected(currentUserId, partnerId);

    if (!connected) {
      return res.status(403).json({ message: "You can only view messages with connections" });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: partnerId },
        { sender: partnerId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessageHistory,
  areConnected,
};
