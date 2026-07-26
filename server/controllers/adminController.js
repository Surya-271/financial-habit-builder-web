const User = require('../models/User');
const Admin = require('../models/Admin');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const SavingsGoal = require('../models/SavingsGoal');
const Investment = require('../models/Investment');
const Asset = require('../models/Asset');
const Feedback = require('../models/Feedback');
const generateToken = require('../utils/jwt');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(401);
      return next(new Error('Invalid admin credentials'));
    }

    const isMatch = await admin.matchPassword(password);

    if (isMatch) {
      res.status(200).json({
        success: true,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid admin credentials'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const suspendedUsers = await User.countDocuments({ role: 'user', status: 'suspended' });
    const totalFeedback = await Feedback.countDocuments({});
    const unreadFeedback = await Feedback.countDocuments({ status: 'unread' });

    // Platform-wide aggregate sums
    const incomes = await Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const expenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const investments = await Investment.aggregate([{ $group: { _id: null, total: { $sum: '$currentValue' } } }]);

    const totalSystemIncome = incomes[0]?.total || 0;
    const totalSystemExpense = expenses[0]?.total || 0;
    const totalSystemInvestments = investments[0]?.total || 0;

    // Savings Goals Statistics
    const totalSavingsGoals = await SavingsGoal.countDocuments({});
    const activeSavingsGoals = await SavingsGoal.countDocuments({ status: 'active' });
    const completedSavingsGoals = await SavingsGoal.countDocuments({ status: 'completed' });
    const savingsTargetAgg = await SavingsGoal.aggregate([{ $group: { _id: null, total: { $sum: '$targetAmount' } } }]);
    const savingsSavedAgg = await SavingsGoal.aggregate([{ $group: { _id: null, total: { $sum: '$currentAmount' } } }]);

    const totalTargetAmount = savingsTargetAgg[0]?.total || 0;
    const totalSavedAmount = savingsSavedAgg[0]?.total || 0;

    // Habit Statistics
    const totalHabits = await Habit.countDocuments({});
    const completedHabitsAgg = await Habit.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.completed': true } },
      { $count: 'count' },
    ]);
    const completedHabits = completedHabitsAgg[0]?.count || 0;

    const totalHistoryAgg = await Habit.aggregate([
      { $project: { size: { $size: '$history' } } },
      { $group: { _id: null, total: { $sum: '$size' } } },
    ]);
    const totalHistoryEntries = totalHistoryAgg[0]?.total || 0;
    const pendingHabits = Math.max(0, totalHistoryEntries - completedHabits);
    const overallHabitCompletionPercentage =
      totalHistoryEntries > 0
        ? Math.round((completedHabits / totalHistoryEntries) * 100)
        : totalHabits > 0
        ? 100
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalFeedback,
        unreadFeedback,
        totalSystemIncome,
        totalSystemExpense,
        totalSystemInvestments,
        // Savings metrics
        totalSavingsGoals,
        activeSavingsGoals,
        completedSavingsGoals,
        totalTargetAmount,
        totalSavedAmount,
        // Habit metrics
        totalHabits,
        completedHabits,
        pendingHabits,
        overallHabitCompletionPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed telemetry and profile for a specific user
// @route   GET /api/admin/users/:id/details
// @access  Private/Admin
const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const userId = user._id;

    // Aggregates for user financial activity
    const incomes = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const expenses = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const totalIncome = incomes[0]?.total || 0;
    const totalExpense = expenses[0]?.total || 0;
    const currentBalance = totalIncome - totalExpense;
    const incomeCount = incomes[0]?.count || 0;
    const expenseCount = expenses[0]?.count || 0;
    const transactionCount = incomeCount + expenseCount;

    const savingsGoalCount = await SavingsGoal.countDocuments({ user: userId });
    const habitCount = await Habit.countDocuments({ user: userId });
    const feedbackCount = await Feedback.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        user,
        totalIncome,
        totalExpense,
        currentBalance,
        savingsGoalCount,
        habitCount,
        transactionCount,
        feedbackCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (suspend/activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been successfully ${user.status === 'active' ? 'activated' : 'suspended'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete user and all their associated records
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const userId = user._id;

    // Delete all user related documents to keep DB clean
    await Income.deleteMany({ user: userId });
    await Expense.deleteMany({ user: userId });
    await Habit.deleteMany({ user: userId });
    await SavingsGoal.deleteMany({ user: userId });
    await Investment.deleteMany({ user: userId });
    await Asset.deleteMany({ user: userId });
    await Feedback.deleteMany({ user: userId });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all linked financial records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user feedbacks
// @route   GET /api/admin/feedback
// @access  Private/Admin
const getFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark feedback as read
// @route   PUT /api/admin/feedback/:id/read
// @access  Private/Admin
const resolveFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      res.status(404);
      return next(new Error('Feedback record not found'));
    }

    feedback.status = 'read';
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit user feedback
// @route   POST /api/admin/feedback
// @access  Private
const submitUserFeedback = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      res.status(400);
      return next(new Error('Please fill in subject and message'));
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change admin account password
// @route   PUT /api/admin/password
// @access  Private/Admin
const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      return next(new Error('Please provide current password and new password'));
    }

    if (newPassword.length < 6) {
      res.status(400);
      return next(new Error('New password must be at least 6 characters long'));
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      res.status(404);
      return next(new Error('Admin account not found'));
    }

    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      res.status(400);
      return next(new Error('Current password is incorrect'));
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getAdminDashboardStats,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  deleteUser,
  getFeedback,
  resolveFeedback,
  submitUserFeedback,
  changeAdminPassword,
};
