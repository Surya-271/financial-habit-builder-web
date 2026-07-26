const Income = require('../models/Income');

// @desc    Get all incomes for logged-in user
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new income
// @route   POST /api/incomes
// @access  Private
const addIncome = async (req, res, next) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category) {
      res.status(400);
      return next(new Error('Please fill in all required fields (title, amount, category)'));
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || new Date(),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an income record
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      return next(new Error('Income record not found'));
    }

    // Verify ownership
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized to update this record'));
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an income record
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      return next(new Error('Income record not found'));
    }

    // Verify ownership
    if (income.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized to delete this record'));
    }

    await income.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Income record removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
};
