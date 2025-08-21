const express = require('express');
const { getPayrollForUser, generatePayroll } = require('../controllers/payrollController');
const router = express.Router();

router.get('/:userId', getPayrollForUser);
router.post('/', generatePayroll);

module.exports = router;

