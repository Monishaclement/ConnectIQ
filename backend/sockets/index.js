const jwt = require("jsonwebtoken");
const Connection = require("../models/Connection");
const Message = require("../models/Message");
const { areConnected } = require("../controllers/message.controller");

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
    socket.broadcast.emit("user_connected", { userId });
    socket.broadcast.emit("user_online", { userId });

    // SEND CONNECTION REQUEST
    socket.on("send_request", async ({ toUserId }) => {
      try {
        const fromUserId = userId;

        const existing = await Connection.findOne({
          $or: [
            { requester: fromUserId, receiver: toUserId },
            { requester: toUserId, receiver: fromUserId },
          ],
        });

        if (existing) {
          if (
            existing.status === "pending" &&
            existing.requester.toString() === fromUserId &&
            existing.receiver.toString() === toUserId
          ) {
            const targetSocket = onlineUsers.get(toUserId);
            if (targetSocket) {
              io.to(targetSocket).emit("receive_request", {
                fromUserId,
                userId: fromUserId,
                requestId: existing._id,
              });
            }
          }
          return;
        }

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
            userId: fromUserId,
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
        if (request.receiver.toString() !== userId) return;

        request.status = "accepted";

        await request.save();

        const requesterSocket = onlineUsers.get(
          request.requester.toString()
        );

        if (requesterSocket) {
          io.to(requesterSocket).emit("request_accepted", {
            fromUserId: request.receiver.toString(),
            userId: request.receiver.toString(),
            requestId: request._id,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // REJECT REQUEST
    socket.on("reject_request", async ({ requestId }) => {
      try {
        const request = await Connection.findById(requestId);

        if (!request) return;
        if (request.receiver.toString() !== userId) return;

        request.status = "rejected";
        await request.save();

        const requesterSocket = onlineUsers.get(request.requester.toString());

        if (requesterSocket) {
          io.to(requesterSocket).emit("request_rejected", {
            fromUserId: request.receiver.toString(),
            requestId: request._id,
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

        const connected = await areConnected(fromUserId, toUserId);
        if (!connected) return;

        // save message
        const savedMessage = await Message.create({
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
            createdAt: savedMessage.createdAt,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    socket.on("typing", ({ toUserId }) => {
      const targetSocket = onlineUsers.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit("typing", { fromUserId: userId });
      }
    });

    socket.on("stop_typing", ({ toUserId }) => {
      const targetSocket = onlineUsers.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit("stop_typing", { fromUserId: userId });
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
