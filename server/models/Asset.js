const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: [3, 'Asset name must be between 3 and 100 characters.'],
      maxlength: [100, 'Asset name must be between 3 and 100 characters.'],
    },
    type: {
      type: String,
      required: [true, 'Please specify if this is an Asset or a Liability'],
      enum: ['Asset', 'Liability'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Real Estate',
        'Cash & Bank Accounts',
        'Vehicles',
        'Gold & Jewelry',
        'Equipment',
        'Personal Loan',
        'Mortgage',
        'Credit Card Debt',
        'Student Loan',
        'Other',
      ],
      default: 'Other',
    },
    value: {
      type: Number,
      required: [true, 'Please specify the valuation/amount'],
      min: [0, 'Value cannot be negative.'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);
