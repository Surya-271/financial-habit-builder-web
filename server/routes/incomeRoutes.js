const express = require('express');
const router = express.Router();
const {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

// Secure all endpoints under this router
router.use(protect);

router.route('/')
  .get(getIncomes)
  .post(addIncome);

router.route('/:id')
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
