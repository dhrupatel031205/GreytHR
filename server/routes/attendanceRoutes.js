const express = require('express');
const { getMyAttendance, clockIn, clockOut } = require('../controllers/attendanceController');
const router = express.Router();

router.get('/:userId', getMyAttendance);
router.post('/:userId/clock-in', clockIn);
router.post('/:userId/clock-out', clockOut);

module.exports = router;

