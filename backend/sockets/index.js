const jwt = require("jsonwebtoken");
const Connection = require("../models/Connection");
const Message = require("../models/Message");

let onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded; // { id: userId }

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    console.log("User connected:", userId);

    // store online user
    onlineUsers.set(userId, socket.id);

    // notify others
    socket.broadcast.emit("user_online", { userId });

    // SEND CONNECTION REQUEST
    socket.on("send_request", async ({ toUserId }) => {
      try {
        const fromUserId = userId;

        // prevent duplicate request
        const existing = await Connection.findOne({
          requester: fromUserId,
          receiver: toUserId,
        });

        if (existing) return;

        // save request
        const request = await Connection.create({
          requester: fromUserId,
          receiver: toUserId,
        });

        // notify receiver if online
        const targetSocket = onlineUsers.get(toUserId);

        if (targetSocket) {
          io.to(targetSocket).emit("receive_request", {
            fromUserId,
            requestId: request._id,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // ACCEPT REQUEST
    socket.on("accept_request", async ({ requestId }) => {
      try {
        const request = await Connection.findById(requestId);

        if (!request) return;

        request.status = "accepted";

        await request.save();

        const requesterSocket = onlineUsers.get(
          request.requester.toString()
        );

        if (requesterSocket) {
          io.to(requesterSocket).emit("request_accepted", {
            fromUserId: request.receiver,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async ({ toUserId, message }) => {
      try {
        const fromUserId = userId;

        // save message
        await Message.create({
          sender: fromUserId,
          receiver: toUserId,
          message,
        });

        // deliver instantly if receiver is online
        const targetSocket = onlineUsers.get(toUserId);

        if (targetSocket) {
          io.to(targetSocket).emit("receive_message", {
            fromUserId,
            message,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      socket.broadcast.emit("user_offline", {
        userId,
      });

      console.log("User disconnected:", userId);
    });
  });
};

module.exports = socketHandler;