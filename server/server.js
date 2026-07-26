const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load configurations
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is missing.');
  throw new Error('JWT_SECRET environment variable is missing.');
}

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const habitRoutes = require('./routes/habitRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const wealthRoutes = require('./routes/wealthRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Models for admin auto-seed
const Admin = require('./models/Admin');

// Initialize app
const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logger
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate Limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Base route for API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy and responsive' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/wealth', wealthRoutes);
app.use('/api/admin', adminRoutes);

// Fallbacks for undefined routes
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Port setup
const PORT = process.env.PORT || 5000;

// Seed administrative user helper
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@tracker.com';
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        name: 'System Administrator',
        email: adminEmail,
        password: 'admin123456', // Will be hashed pre-save
      });
      console.log('Seeded default admin user: email: admin@tracker.com, password: admin123456');
    }
  } catch (error) {
    console.error(`Admin Seeding Failed: ${error.message}`);
  }
};

// Connect to Database and start Express server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    // Run admin seed
    await seedAdmin();
  });
};

startServer();
