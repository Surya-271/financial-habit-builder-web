const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals for user
// @route   GET /api/savings
// @access  Private
const getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort({ deadline: 1 });
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

const createSavingsGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, currentAmount, category, deadline } = req.body;

    if (!name || !targetAmount || !deadline) {
      res.status(400);
      return next(new Error('Please provide name, targetAmount, and deadline'));
    }

    const current = Number(currentAmount) || 0;
    const target = Number(targetAmount);

    if (current > target) {
      res.status(400);
      return next(new Error('Initial savings cannot exceed the target amount.'));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const goalDeadline = new Date(deadline);
    if (goalDeadline < today) {
      res.status(400);
      return next(new Error('Deadline cannot be in the past.'));
    }

    const goal = await SavingsGoal.create({
      user: req.user._id,
      name,
      targetAmount: target,
      currentAmount: current,
      category: category || 'Other',
      deadline: new Date(deadline),
      status: current >= target ? 'completed' : 'active',
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update savings goal details
// @route   PUT /api/savings/:id
// @access  Private
const updateSavingsGoal = async (req, res, next) => {
  try {
    let goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      return next(new Error('Savings goal not found'));
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to edit this savings goal'));
    }

    // Merge manual values
    const current = req.body.currentAmount !== undefined ? Number(req.body.currentAmount) : goal.currentAmount;
    const target = req.body.targetAmount !== undefined ? Number(req.body.targetAmount) : goal.targetAmount;

    if (current > target) {
      res.status(400);
      return next(new Error('Initial savings cannot exceed the target amount.'));
    }

    if (req.body.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const goalDeadline = new Date(req.body.deadline);
      if (goalDeadline < today) {
        res.status(400);
        return next(new Error('Deadline cannot be in the past.'));
      }
    }

    req.body.status = current >= target ? 'completed' : 'active';

    goal = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add funds to a savings goal
// @route   POST /api/savings/:id/add-funds
// @access  Private
const addSavingsProgress = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      res.status(400);
      return next(new Error('Please provide a positive amount to add'));
    }

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      return next(new Error('Savings goal not found'));
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to access this savings goal'));
    }

    goal.currentAmount += Number(amount);
    goal.status = goal.currentAmount >= goal.targetAmount ? 'completed' : 'active';

    await goal.save();

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/savings/:id
// @access  Private
const deleteSavingsGoal = async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      return next(new Error('Savings goal not found'));
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to delete this savings goal'));
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addSavingsProgress,
  deleteSavingsGoal,
};
