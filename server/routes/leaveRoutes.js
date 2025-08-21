const express = require('express');
const { requestLeave, getMyLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const router = express.Router();

router.get('/:userId', getMyLeaves);
router.post('/', requestLeave);
router.put('/:id/status', updateLeaveStatus);

module.exports = router;

