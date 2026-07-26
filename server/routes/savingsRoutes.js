const express = require('express');
const router = express.Router();
const {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addSavingsProgress,
  deleteSavingsGoal,
} = require('../controllers/savingsController');
const { protect } = require('../middleware/authMiddleware');

// Secure all endpoints under this router
router.use(protect);

router.route('/')
  .get(getSavingsGoals)
  .post(createSavingsGoal);

router.route('/:id')
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

router.post('/:id/add-funds', addSavingsProgress);

module.exports = router;
