const Connection = require("../models/Connection");

const userSelect = "name email profileImage skills interests location trustScore riskScore";

const toConnectionView = (connection, currentUserId) => {
  const requesterId = connection.requester?._id?.toString() || connection.requester?.toString();
  const receiverId = connection.receiver?._id?.toString() || connection.receiver?.toString();
  const isRequester = requesterId === currentUserId;
  const otherUser = isRequester ? connection.receiver : connection.requester;

  return {
    requestId: connection._id,
    status: connection.status,
    createdAt: connection.createdAt,
    updatedAt: connection.updatedAt,
    requester: connection.requester,
    receiver: connection.receiver,
    user: otherUser,
    userId: otherUser?._id?.toString() || otherUser?.toString(),
    fromUserId: requesterId,
    toUserId: receiverId,
  };
};

const getConnections = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const connections = await Connection.find({
      $or: [{ requester: currentUserId }, { receiver: currentUserId }],
      status: { $in: ["pending", "accepted"] },
    })
      .populate("requester", userSelect)
      .populate("receiver", userSelect)
      .sort({ updatedAt: -1 });

    const grouped = {
      pending: [],
      sent: [],
      accepted: [],
    };

    connections.forEach((connection) => {
      const view = toConnectionView(connection, currentUserId);

      if (connection.status === "accepted") {
        grouped.accepted.push(view);
        return;
      }

      if (view.toUserId === currentUserId) {
        grouped.pending.push(view);
      } else {
        grouped.sent.push(view);
      }
    });

    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const requester = req.user.id;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ message: "Target user is required" });
    }

    if (requester === toUserId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester, receiver: toUserId },
        { requester: toUserId, receiver: requester },
      ],
    });

    if (existing) {
      if (existing.status === "rejected") {
        existing.requester = requester;
        existing.receiver = toUserId;
        existing.status = "pending";
        await existing.save();
        await existing.populate("requester", userSelect);
        await existing.populate("receiver", userSelect);
        return res.status(200).json(toConnectionView(existing, requester));
      }

      return res.status(409).json({ message: "Connection already exists" });
    }

    const connection = await Connection.create({
      requester,
      receiver: toUserId,
    });

    await connection.populate("requester", userSelect);
    await connection.populate("receiver", userSelect);

    res.status(201).json(toConnectionView(connection, requester));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Connection already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const connection = await Connection.findOne({
      _id: req.params.id,
      receiver: currentUserId,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Pending request not found" });
    }

    connection.status = "accepted";
    await connection.save();
    await connection.populate("requester", userSelect);
    await connection.populate("receiver", userSelect);

    res.status(200).json(toConnectionView(connection, currentUserId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      receiver: req.user.id,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Pending request not found" });
    }

    connection.status = "rejected";
    await connection.save();

    res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findOneAndDelete({
      _id: req.params.id,
      requester: req.user.id,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Sent request not found" });
    }

    res.status(200).json({ message: "Connection request cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const connection = await Connection.findOneAndDelete({
      status: "accepted",
      $or: [
        { requester: currentUserId, receiver: otherUserId },
        { requester: otherUserId, receiver: currentUserId },
      ],
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
};
