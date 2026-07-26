const Investment = require('../models/Investment');
const Asset = require('../models/Asset');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SavingsGoal = require('../models/SavingsGoal');
const Habit = require('../models/Habit');

// ==========================================
// INVESTMENT CRUD
// ==========================================

const getInvestments = async (req, res, next) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({ purchaseDate: -1 });
    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments,
    });
  } catch (error) {
    next(error);
  }
};

const createInvestment = async (req, res, next) => {
  try {
    const { name, type, amountInvested, currentValue, purchaseDate, description } = req.body;

    if (!name || !type || amountInvested === undefined || currentValue === undefined) {
      res.status(400);
      return next(new Error('Please fill in all required fields (name, type, amountInvested, currentValue)'));
    }

    const trimmedName = name ? name.trim() : '';
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      res.status(400);
      return next(new Error('Asset name must be between 3 and 100 characters.'));
    }

    const amt = Number(amountInvested);
    if (isNaN(amt) || amt <= 0) {
      res.status(400);
      return next(new Error('Invested amount must be greater than zero.'));
    }

    const val = Number(currentValue);
    if (isNaN(val) || val < 0) {
      res.status(400);
      return next(new Error('Current value cannot be negative.'));
    }

    if (purchaseDate) {
      const pDate = new Date(purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (pDate > today) {
        res.status(400);
        return next(new Error('Purchase date cannot be in the future.'));
      }
    }

    const investment = await Investment.create({
      user: req.user._id,
      name: trimmedName,
      type,
      amountInvested: amt,
      currentValue: val,
      purchaseDate: purchaseDate || new Date(),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

const updateInvestment = async (req, res, next) => {
  try {
    let investment = await Investment.findById(req.params.id);

    if (!investment) {
      res.status(404);
      return next(new Error('Investment not found'));
    }

    if (investment.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to edit this investment'));
    }

    const name = req.body.name;
    if (name !== undefined) {
      const trimmedName = name ? name.trim() : '';
      if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
        res.status(400);
        return next(new Error('Asset name must be between 3 and 100 characters.'));
      }
      req.body.name = trimmedName;
    }

    const amountInvested = req.body.amountInvested;
    if (amountInvested !== undefined && Number(amountInvested) <= 0) {
      res.status(400);
      return next(new Error('Invested amount must be greater than zero.'));
    }

    const currentValue = req.body.currentValue;
    if (currentValue !== undefined && Number(currentValue) < 0) {
      res.status(400);
      return next(new Error('Current value cannot be negative.'));
    }

    const purchaseDate = req.body.purchaseDate;
    if (purchaseDate) {
      const pDate = new Date(purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (pDate > today) {
        res.status(400);
        return next(new Error('Purchase date cannot be in the future.'));
      }
    }

    investment = await Investment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      res.status(404);
      return next(new Error('Investment not found'));
    }

    if (investment.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to delete this investment'));
    }

    await investment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Investment removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ASSET/LIABILITY CRUD
// ==========================================

const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const { name, type, category, value } = req.body;

    if (!name || !type || !category || value === undefined) {
      res.status(400);
      return next(new Error('Please fill in all required fields (name, type, category, value)'));
    }

    const trimmedName = name ? name.trim() : '';
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      res.status(400);
      return next(new Error('Asset name must be between 3 and 100 characters.'));
    }

    const val = Number(value);
    if (isNaN(val) || val < 0) {
      res.status(400);
      return next(new Error('Value cannot be negative.'));
    }

    const asset = await Asset.create({
      user: req.user._id,
      name: trimmedName,
      type,
      category,
      value: val,
    });

    res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    let asset = await Asset.findById(req.params.id);

    if (!asset) {
      res.status(404);
      return next(new Error('Asset record not found'));
    }

    if (asset.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to edit this record'));
    }

    const name = req.body.name;
    if (name !== undefined) {
      const trimmedName = name ? name.trim() : '';
      if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
        res.status(400);
        return next(new Error('Asset name must be between 3 and 100 characters.'));
      }
      req.body.name = trimmedName;
    }

    const value = req.body.value;
    if (value !== undefined && Number(value) < 0) {
      res.status(400);
      return next(new Error('Value cannot be negative.'));
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      res.status(404);
      return next(new Error('Asset record not found'));
    }

    if (asset.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to delete this record'));
    }

    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Asset record removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UNIFIED ANALYTICS ENGINE
// ==========================================

const getWealthDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch User Data
    const incomes = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });
    const investments = await Investment.find({ user: userId });
    const assetsList = await Asset.find({ user: userId });
    const goals = await SavingsGoal.find({ user: userId });
    const habits = await Habit.find({ user: userId });

    // 2. Calculations: Totals
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSavings = totalIncome - totalExpense;

    // Investment valuations
    const totalInvestedPrincipal = investments.reduce((acc, curr) => acc + curr.amountInvested, 0);
    const currentInvestmentValue = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
    const investmentGrowth = currentInvestmentValue - totalInvestedPrincipal;

    // Assets & Liabilities
    const totalAssetsValue = assetsList
      .filter(a => a.type === 'Asset')
      .reduce((acc, curr) => acc + curr.value, 0);

    const totalLiabilitiesValue = assetsList
      .filter(a => a.type === 'Liability')
      .reduce((acc, curr) => acc + curr.value, 0);

    // Net Worth = Sum of cash assets + investment values + physical assets - debts
    const netWorth = totalAssetsValue + currentInvestmentValue - totalLiabilitiesValue;

    // Savings Rate
    const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

    // 3. Category Breakdowns for charts
    const expenseBreakdown = {};
    expenses.forEach(e => {
      expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount;
    });

    const incomeBreakdown = {};
    incomes.forEach(i => {
      incomeBreakdown[i.category] = (incomeBreakdown[i.category] || 0) + i.amount;
    });

    // 4. Monthly trends (over the last 6 months)
    const monthlyTrends = {};
    // Seed last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyTrends[label] = { income: 0, expense: 0, savings: 0 };
    }

    incomes.forEach(inc => {
      const label = inc.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyTrends[label]) {
        monthlyTrends[label].income += inc.amount;
      }
    });

    expenses.forEach(exp => {
      const label = exp.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyTrends[label]) {
        monthlyTrends[label].expense += exp.amount;
      }
    });

    // Calculate monthly savings
    Object.keys(monthlyTrends).forEach(key => {
      monthlyTrends[key].savings = monthlyTrends[key].income - monthlyTrends[key].expense;
    });

    // 5. Recent Activity Feed (Merge income & expense and get latest 5)
    const mergedActivity = [
      ...incomes.map(i => ({
        _id: i._id,
        type: 'income',
        title: i.title,
        amount: i.amount,
        category: i.category,
        date: i.date,
      })),
      ...expenses.map(e => ({
        _id: e._id,
        type: 'expense',
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const recentActivities = mergedActivity.slice(0, 5);

    // 6. Habit Analytics
    const totalHabits = habits.length;
    const totalStreaks = habits.reduce((acc, h) => acc + h.currentStreak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;
    const maxStreak = totalHabits > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0;

    // 7. Goal summaries
    const goalsCount = goals.length;
    const completedGoalsCount = goals.filter(g => g.status === 'completed').length;
    const avgGoalProgress = goalsCount > 0
      ? Math.round(
          (goals.reduce((acc, g) => acc + (g.currentAmount / g.targetAmount), 0) / goalsCount) * 100
        )
      : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        totalSavings,
        savingsRate,
        netWorth,
        assets: totalAssetsValue,
        liabilities: totalLiabilitiesValue,
        totalInvested: totalInvestedPrincipal,
        currentInvestmentValue,
        investmentGrowth,
      },
      charts: {
        expenseBreakdown,
        incomeBreakdown,
        monthlyTrends,
      },
      recentActivities,
      habits: {
        totalHabits,
        avgStreak,
        maxStreak,
      },
      goals: {
        totalGoals: goalsCount,
        completedGoals: completedGoalsCount,
        avgProgress: avgGoalProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getWealthDashboardData,
};
