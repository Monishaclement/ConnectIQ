const User = require("../models/User");

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bio,
      skills,
      interests,
      location,
      profileImage,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        skills,
        interests,
        location,
        profileImage,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateProfile,
};