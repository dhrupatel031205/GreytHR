import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  cancelLeave,
  getLeaveBalance,
  getLeaveStats
} from '../controllers/leaveController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.delete('/:id', cancelLeave);

// HR/Admin routes
router.get('/all', authorize('admin', 'hr'), getAllLeaves);
router.put('/:id/approve', authorize('admin', 'hr'), approveLeave);
router.get('/stats', authorize('admin', 'hr'), getLeaveStats);

export default router;