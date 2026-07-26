const Expense = require('../models/Expense');

// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category) {
      res.status(400);
      return next(new Error('Please fill in all required fields (title, amount, category)'));
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || new Date(),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense record
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      return next(new Error('Expense record not found'));
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized to update this record'));
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense record
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      return next(new Error('Expense record not found'));
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized to delete this record'));
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense record removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};
