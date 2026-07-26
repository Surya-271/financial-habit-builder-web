const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financial_habit_tracker');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database Connection Error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
};

module.exports = connectDB;
