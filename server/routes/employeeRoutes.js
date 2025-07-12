const express = require('express');
const router = express.Router();
const {
  getEmployeeByUserId,
} = require('../controllers/employeeController');

// @route GET /api/employee/user/:userId
router.get('/user/:userId', getEmployeeByUserId);

module.exports = router;
