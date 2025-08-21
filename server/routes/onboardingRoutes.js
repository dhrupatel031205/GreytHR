const express = require('express');
const { getOnboarding, updateOnboarding } = require('../controllers/onboardingController');
const router = express.Router();

router.get('/:userId', getOnboarding);
router.put('/:userId', updateOnboarding);

module.exports = router;

