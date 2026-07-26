const Habit = require('../models/Habit');

// Helper to format date as YYYY-MM-DD in local time
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to calculate current and longest streaks
const computeStreaks = (history, frequency) => {
  if (!history || history.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Filter only completed dates and sort chronologically (oldest to newest)
  const completedDates = history
    .filter(item => item.completed)
    .map(item => item.date)
    .sort();

  if (completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longest = 0;
  let current = 0;

  const todayStr = getLocalDateString();
  const todayDate = new Date(todayStr);

  if (frequency === 'daily') {
    // Check if user has checked in for today or yesterday. If not, current streak breaks.
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterdayDate);

    const hasToday = completedDates.includes(todayStr);
    const hasYesterday = completedDates.includes(yesterdayStr);

    // Calculate longest streak in history
    let tempStreak = 0;
    let prevDate = null;

    for (let i = 0; i < completedDates.length; i++) {
      const currDate = new Date(completedDates[i]);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak += 1;
        } else if (diffDays > 1) {
          if (tempStreak > longest) longest = tempStreak;
          tempStreak = 1;
        }
      }
      prevDate = currDate;
    }
    if (tempStreak > longest) longest = tempStreak;

    // Calculate current streak
    if (!hasToday && !hasYesterday) {
      current = 0;
    } else {
      current = 0;
      let checkDate = hasToday ? todayDate : yesterdayDate;
      
      while (true) {
        const checkStr = getLocalDateString(checkDate);
        if (completedDates.includes(checkStr)) {
          current++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  } else if (frequency === 'weekly') {
    // For weekly habits, we measure week-by-week (7 days interval approximate)
    // We group check-ins by their calendar week (standard Sunday-Saturday or just division of days)
    // To keep it simple and robust, we count continuous weeks in which at least one completion exists.
    const getWeekId = (dateStr) => {
      const date = new Date(dateStr);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      return `${date.getFullYear()}-W${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
    };

    const completedWeeks = [...new Set(completedDates.map(getWeekId))].sort();
    
    // Find longest week-based streak
    let tempStreak = 0;
    let prevWeekNum = null; // We can parse year-Wnum to check if consecutive

    const parseWeek = (weekStr) => {
      const parts = weekStr.split('-W');
      return { year: parseInt(parts[0]), week: parseInt(parts[1]) };
    };

    const isConsecutiveWeek = (w1, w2) => {
      if (w2.year === w1.year) {
        return w2.week - w1.week === 1;
      }
      // Handle year transition (week 52/53 to week 1)
      if (w2.year - w1.year === 1 && w1.week >= 52 && w2.week === 1) {
        return true;
      }
      return false;
    };

    for (let i = 0; i < completedWeeks.length; i++) {
      const curr = parseWeek(completedWeeks[i]);
      if (!prevWeekNum) {
        tempStreak = 1;
      } else {
        if (isConsecutiveWeek(prevWeekNum, curr)) {
          tempStreak += 1;
        } else if (completedWeeks[i] !== completedWeeks[i - 1]) {
          if (tempStreak > longest) longest = tempStreak;
          tempStreak = 1;
        }
      }
      prevWeekNum = curr;
    }
    if (tempStreak > longest) longest = tempStreak;

    // Check current week
    const currentWeekId = getWeekId(todayStr);
    const lastWeekId = getWeekId(getLocalDateString(new Date(todayDate.getTime() - 7 * 24 * 60 * 60 * 1000)));

    if (!completedWeeks.includes(currentWeekId) && !completedWeeks.includes(lastWeekId)) {
      current = 0;
    } else {
      current = 0;
      let checkWeekDate = completedWeeks.includes(currentWeekId) ? todayDate : new Date(todayDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      let checked = true;
      while (checked) {
        const wId = getWeekId(getLocalDateString(checkWeekDate));
        if (completedWeeks.includes(wId)) {
          current++;
          checkWeekDate.setTime(checkWeekDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          checked = false;
        }
      }
    }
  } else if (frequency === 'monthly') {
    const getMonthId = (dateStr) => dateStr.substring(0, 7); // 'YYYY-MM'
    const completedMonths = [...new Set(completedDates.map(getMonthId))].sort();

    // Longest streak
    let tempStreak = 0;
    let prevMonth = null;

    const isConsecutiveMonth = (m1, m2) => {
      const d1 = new Date(m1 + '-01');
      const d2 = new Date(m2 + '-01');
      const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      return diffMonths === 1;
    };

    for (let i = 0; i < completedMonths.length; i++) {
      if (!prevMonth) {
        tempStreak = 1;
      } else {
        if (isConsecutiveMonth(prevMonth, completedMonths[i])) {
          tempStreak += 1;
        } else {
          if (tempStreak > longest) longest = tempStreak;
          tempStreak = 1;
        }
      }
      prevMonth = completedMonths[i];
    }
    if (tempStreak > longest) longest = tempStreak;

    // Current streak
    const currentMonthId = todayStr.substring(0, 7);
    const lastMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
    const lastMonthId = getLocalDateString(lastMonthDate).substring(0, 7);

    if (!completedMonths.includes(currentMonthId) && !completedMonths.includes(lastMonthId)) {
      current = 0;
    } else {
      current = 0;
      let checkDate = completedMonths.includes(currentMonthId) ? todayDate : lastMonthDate;
      let year = checkDate.getFullYear();
      let month = checkDate.getMonth();

      while (true) {
        const mId = `${year}-${String(month + 1).padStart(2, '0')}`;
        if (completedMonths.includes(mId)) {
          current++;
          month--;
          if (month < 0) {
            month = 11;
            year--;
          }
        } else {
          break;
        }
      }
    }
  }

  return {
    currentStreak: current,
    longestStreak: Math.max(longest, current),
  };
};

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Add completion percentage dynamically on fetch
    const responseData = habits.map(h => {
      const obj = h.toObject();
      const completedCount = h.history.filter(item => item.completed).length;
      
      // Calculate completion percent based on history length or set a default
      obj.completionPercentage = h.history.length > 0 
        ? Math.round((completedCount / h.history.length) * 100) 
        : 0;

      // Completed today flag
      const todayStr = getLocalDateString();
      obj.completedToday = h.history.some(item => item.date === todayStr && item.completed);

      return obj;
    });

    res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, target } = req.body;

    const trimmedName = name ? name.trim() : '';
    if (!trimmedName) {
      res.status(400);
      return next(new Error('Habit name cannot be empty or contain only whitespace.'));
    }

    if (trimmedName.length < 3 || trimmedName.length > 100) {
      res.status(400);
      return next(new Error('Habit name must be between 3 and 100 characters.'));
    }

    const targetVal = target !== undefined ? Number(target) : 1;
    if (isNaN(targetVal) || targetVal <= 0) {
      res.status(400);
      return next(new Error('Target value must be greater than zero.'));
    }

    const selectedFreq = frequency || 'daily';
    if (!['daily', 'weekly', 'monthly'].includes(selectedFreq)) {
      res.status(400);
      return next(new Error('Please select a valid frequency (daily, weekly, or monthly).'));
    }

    // Check for duplicate habit name for this user (case-insensitive)
    const duplicate = await Habit.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (duplicate) {
      res.status(409);
      return next(new Error('A habit with this name already exists.'));
    }

    const habit = await Habit.create({
      user: req.user._id,
      name: trimmedName,
      description: description || '',
      frequency: selectedFreq,
      target: targetVal,
      currentStreak: 0,
      longestStreak: 0,
      history: [],
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit completion status for a specific date
// @route   POST /api/habits/:id/toggle
// @access  Private
const toggleHabitDate = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404);
      return next(new Error('Habit not found'));
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to access this habit'));
    }

    // Default to local today if no date provided in body
    const targetDateStr = req.body.date || getLocalDateString();

    const todayStr = getLocalDateString();
    if (targetDateStr !== todayStr) {
      res.status(400);
      return next(new Error('Habits can only be marked as completed for today.'));
    }

    // Check if targetDateStr exists in history
    const existingIndex = habit.history.findIndex(item => item.date === targetDateStr);

    if (existingIndex > -1 && habit.history[existingIndex].completed) {
      res.status(400);
      return next(new Error("Today's habit is already completed."));
    }

    if (existingIndex > -1) {
      habit.history[existingIndex].completed = true;
    } else {
      habit.history.push({ date: targetDateStr, completed: true });
    }

    // Compute updated streaks dynamically
    const streaks = computeStreaks(habit.history, habit.frequency);
    habit.currentStreak = streaks.currentStreak;
    habit.longestStreak = streaks.longestStreak;

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a habit details (name, description, frequency)
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404);
      return next(new Error('Habit not found'));
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to edit this habit'));
    }

    if (req.body.name !== undefined) {
      const trimmedName = req.body.name.trim();
      if (!trimmedName) {
        res.status(400);
        return next(new Error('Habit name cannot be empty or contain only whitespace.'));
      }
      if (trimmedName.length < 3 || trimmedName.length > 100) {
        res.status(400);
        return next(new Error('Habit name must be between 3 and 100 characters.'));
      }

      if (trimmedName.toLowerCase() !== habit.name.toLowerCase()) {
        const duplicate = await Habit.findOne({
          user: req.user._id,
          _id: { $ne: habit._id },
          name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
        });

        if (duplicate) {
          res.status(409);
          return next(new Error('A habit with this name already exists.'));
        }
      }
      habit.name = trimmedName;
    }

    if (req.body.target !== undefined) {
      const targetVal = Number(req.body.target);
      if (isNaN(targetVal) || targetVal <= 0) {
        res.status(400);
        return next(new Error('Target value must be greater than zero.'));
      }
      habit.target = targetVal;
    }

    if (req.body.frequency !== undefined) {
      const selectedFreq = req.body.frequency;
      if (!['daily', 'weekly', 'monthly'].includes(selectedFreq)) {
        res.status(400);
        return next(new Error('Please select a valid frequency (daily, weekly, or monthly).'));
      }

      if (selectedFreq !== habit.frequency) {
        habit.frequency = selectedFreq;
        const streaks = computeStreaks(habit.history, habit.frequency);
        habit.currentStreak = streaks.currentStreak;
        habit.longestStreak = streaks.longestStreak;
      }
    }

    habit.description = req.body.description !== undefined ? req.body.description : habit.description;

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404);
      return next(new Error('Habit not found'));
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to delete this habit'));
    }

    await habit.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  createHabit,
  toggleHabitDate,
  updateHabit,
  deleteHabit,
};
