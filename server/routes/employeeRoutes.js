const express = require('express');
const router = express.Router();
const {
  getEmployeeByUserId,
  updateEmployeeById,
} = require('../controllers/employeeController');

// @route GET /api/employee/user/:userId
router.get('/user/:userId', getEmployeeByUserId);

// @route PUT /api/employee/:id
router.put('/:id', updateEmployeeById);

module.exports = router;
