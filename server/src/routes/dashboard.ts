import express from 'express';
import {
  getDashboardStats,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getEmployeeReport
} from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats (accessible to all authenticated users)
router.get('/stats', getDashboardStats);

// Reports (HR/Admin only)
router.get('/reports/attendance', authorize('admin', 'hr'), getAttendanceReport);
router.get('/reports/leave', authorize('admin', 'hr'), getLeaveReport);
router.get('/reports/payroll', authorize('admin', 'hr'), getPayrollReport);
router.get('/reports/employee', authorize('admin', 'hr'), getEmployeeReport);

export default router;