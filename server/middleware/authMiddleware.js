const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes for logged in users
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using Firebase Admin SDK
      let decodedToken;
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
      } catch (err) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }

      // Get user from database (excluding password) using firebaseUid and attach to request
      req.user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-password');
      
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      if (req.user.status === 'suspended') {
        res.status(403);
        return next(new Error('This account has been suspended by the administrator.'));
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }


  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

// Protect routes for administrators
const protectAdmin = async (req, res, next) => {
  let token;

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is missing.');
    res.status(500);
    return next(new Error('JWT_SECRET environment variable is missing.'));
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's an admin account
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        res.status(401);
        return next(new Error('Not authorized as an admin'));
      }

      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, admin token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no admin token provided'));
  }
};

module.exports = {
  protect,
  protectAdmin,
};
