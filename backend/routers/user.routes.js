const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  updateProfile,
} = require("../controllers/user.controller");

router.put("/profile", protect, updateProfile);

module.exports = router;