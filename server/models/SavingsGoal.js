const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a goal name'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please add a target amount'],
      min: [1, 'Target amount must be greater than zero'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current savings cannot be negative'],
    },
    category: {
      type: String,
      enum: ['Emergency Fund', 'Vacation', 'Laptop', 'Bike', 'Education', 'Home', 'Retirement', 'Other'],
      default: 'Other',
    },
    deadline: {
      type: Date,
      required: [true, 'Please select a target deadline'],
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate progress percentage
savingsGoalSchema.virtual('progressPercent').get(function () {
  if (!this.targetAmount) return 0;
  const percentage = (this.currentAmount / this.targetAmount) * 100;
  return Math.min(100, Math.round(percentage));
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
