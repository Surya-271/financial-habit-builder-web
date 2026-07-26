const User = require('../models/User');
const admin = require('../config/firebaseAdmin');

// @desc    Register a new user (sync Firebase signup with MongoDB)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name } = req.body;
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(400);
      return next(new Error('Please provide Firebase Authorization token'));
    }

    if (!name) {
      res.status(400);
      return next(new Error('Please provide name'));
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, uid } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (user) {
      res.status(400);
      return next(new Error('User already exists in MongoDB'));
    }

    // Check if email already used
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Create user in MongoDB
    user = await User.create({
      name,
      email,
      firebaseUid: uid,
      isVerified: decodedToken.email_verified || false,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user & get profile (verify Firebase token)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(400);
      return next(new Error('Please provide Firebase Authorization token'));
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Find user
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      // Lazy sync: link existing email user to firebaseUid
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUid = uid;
        await user.save();
      } else {
        res.status(404);
        return next(new Error('User not found in MongoDB. Please register.'));
      }
    }

    // Check status
    if (user.status === 'suspended') {
      res.status(403);
      return next(new Error('This account has been suspended by the administrator.'));
    }

    // Synchronize Firebase email verification status with MongoDB
    if (decodedToken.email_verified && !user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Update profile subdocument
      if (req.body.profile) {
        user.profile.bio = req.body.profile.bio !== undefined ? req.body.profile.bio : user.profile.bio;
        user.profile.phone = req.body.profile.phone !== undefined ? req.body.profile.phone : user.profile.phone;
        user.profile.currency = req.body.profile.currency !== undefined ? req.body.profile.currency : user.profile.currency;
        user.profile.monthlyBudget = req.body.profile.monthlyBudget !== undefined ? Number(req.body.profile.monthlyBudget) : user.profile.monthlyBudget;
      }

      // Password changes are handled on frontend via Firebase, so we bypass saving password to Mongo

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};

