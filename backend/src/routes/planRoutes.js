const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPlans).post(protect, createPlan);
router.route('/:id').put(protect, updatePlan).delete(protect, deletePlan);

module.exports = router;
