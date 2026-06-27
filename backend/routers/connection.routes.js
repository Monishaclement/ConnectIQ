const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  getConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
} = require("../controllers/connection.controller");

const router = express.Router();

router.get("/", protect, getConnections);
router.post("/", protect, sendConnectionRequest);
router.patch("/:id/accept", protect, acceptConnectionRequest);
router.patch("/:id/reject", protect, rejectConnectionRequest);
router.delete("/:id/cancel", protect, cancelConnectionRequest);
router.delete("/users/:userId", protect, removeConnection);

module.exports = router;
