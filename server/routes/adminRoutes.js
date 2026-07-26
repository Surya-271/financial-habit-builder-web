const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminDashboardStats,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  deleteUser,
  getFeedback,
  resolveFeedback,
  submitUserFeedback,
  changeAdminPassword,
} = require('../controllers/adminController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

// Public route for admin login
router.post('/login', adminLogin);

// Protected user route: submit feedback
router.post('/feedback', protect, submitUserFeedback);

// Protected admin routes (JWT + Admin Role check)
router.use(protectAdmin);

router.get('/dashboard', getAdminDashboardStats);
router.route('/users')
  .get(getAllUsers);

router.get('/users/:id/details', getUserDetails);

router.route('/users/:id')
  .delete(deleteUser);

router.put('/users/:id/status', toggleUserStatus);

router.route('/feedback')
  .get(getFeedback);

router.put('/feedback/:id/read', resolveFeedback);

router.put('/password', changeAdminPassword);

module.exports = router;
