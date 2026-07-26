const express = require('express');
const router = express.Router();
const {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getWealthDashboardData,
} = require('../controllers/wealthController');
const { protect } = require('../middleware/authMiddleware');

// Secure all endpoints under this router
router.use(protect);

// Dashboard Aggregation
router.get('/dashboard', getWealthDashboardData);

// Investments CRUD
router.route('/investments')
  .get(getInvestments)
  .post(createInvestment);

router.route('/investments/:id')
  .put(updateInvestment)
  .delete(deleteInvestment);

// Assets/Liabilities CRUD
router.route('/assets')
  .get(getAssets)
  .post(createAsset);

router.route('/assets/:id')
  .put(updateAsset)
  .delete(deleteAsset);

module.exports = router;
