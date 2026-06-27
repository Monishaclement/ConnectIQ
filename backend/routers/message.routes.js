const express = require("express");
const protect = require("../middleware/auth.middleware");
const { getMessageHistory } = require("../controllers/message.controller");

const router = express.Router();

router.get("/:userId", protect, getMessageHistory);

module.exports = router;
