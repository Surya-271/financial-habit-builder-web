const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add an investment name'],
      trim: true,
      minlength: [3, 'Asset name must be between 3 and 100 characters.'],
      maxlength: [100, 'Asset name must be between 3 and 100 characters.'],
    },
    type: {
      type: String,
      required: [true, 'Please specify an investment type'],
      enum: ['Stocks', 'Mutual Funds', 'Bonds', 'Crypto', 'Fixed Deposit', 'Gold', 'Real Estate', 'Other'],
      default: 'Other',
    },
    amountInvested: {
      type: Number,
      required: [true, 'Please specify the amount invested'],
      min: [0.01, 'Invested amount must be greater than zero.'],
    },
    currentValue: {
      type: Number,
      required: [true, 'Please specify the current value'],
      min: [0, 'Current value cannot be negative.'],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (v) {
          if (!v) return true;
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return v <= today;
        },
        message: 'Purchase date cannot be in the future.',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate return on investment (ROI) amount and percent
investmentSchema.virtual('returns').get(function () {
  return this.currentValue - this.amountInvested;
});

investmentSchema.virtual('returnsPercent').get(function () {
  if (!this.amountInvested) return 0;
  return Math.round(((this.currentValue - this.amountInvested) / this.amountInvested) * 100);
});

module.exports = mongoose.model('Investment', investmentSchema);
