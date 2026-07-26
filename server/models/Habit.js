const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a habit name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    target: {
      type: Number,
      required: [true, 'Please add a target value'],
      min: [1, 'Target value must be greater than zero'],
      default: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    // Array of completed date strings (format: YYYY-MM-DD) for simple querying and rendering
    history: [
      {
        date: {
          type: String, // 'YYYY-MM-DD'
          required: true,
        },
        completed: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries
habitSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Habit', habitSchema);
