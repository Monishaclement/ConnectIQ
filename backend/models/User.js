const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    interests: [
      {
        type: String,
      },
    ],

    location: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    // ⭐ Matching Engine Fields
    trustScore: {
      type: Number,
      default: 50, // starts neutral (0–100)
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    profileCompleteness: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);