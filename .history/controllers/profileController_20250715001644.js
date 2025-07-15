// controllers/profileController.js
const User = require('../models/User');
const { countries } = require('countries-list');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -pin');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { bio, profilePic, role, type, language } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    user.role = role || user.role;
    user.type = type || user.type;
    user.language = language || user.language;
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'Profile updated!' });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};