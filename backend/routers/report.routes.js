const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  reportUser,
} = require("../controllers/report.controller");

router.post("/", protect, reportUser);

module.exports = router;