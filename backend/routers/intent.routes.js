const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  getIntents,
  getIntentById,
  createIntent,
  updateIntent,
  deleteIntent,
} = require("../controllers/intent.controller");

const router = express.Router();

router.get("/", protect, getIntents);
router.get("/:id", protect, getIntentById);
router.post("/", protect, createIntent);
router.put("/:id", protect, updateIntent);
router.delete("/:id", protect, deleteIntent);

module.exports = router;
