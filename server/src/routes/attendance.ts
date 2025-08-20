import express from 'express';
import {
  punchIn,
  punchOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceReport,
  updateAttendance,
  getDashboardStats
} from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.get('/today', getTodayAttendance);
router.get('/history', getAttendanceHistory);

// HR/Admin routes
router.get('/report', authorize('admin', 'hr'), getAttendanceReport);
router.get('/dashboard-stats', authorize('admin', 'hr'), getDashboardStats);
router.put('/:id', authorize('admin', 'hr'), updateAttendance);

export default router;