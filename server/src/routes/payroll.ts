import express from 'express';
import {
  generatePayroll,
  getPayrollByEmployee,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  processPayroll,
  markPayrollAsPaid,
  bulkGeneratePayroll,
  getPayrollStats
} from '../controllers/payrollController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/my-payroll', getPayrollByEmployee);

// HR/Admin routes
router.get('/all', authorize('admin', 'hr'), getAllPayrolls);
router.get('/stats', authorize('admin', 'hr'), getPayrollStats);
router.get('/:id', authorize('admin', 'hr'), getPayrollById);
router.post('/generate', authorize('admin', 'hr'), generatePayroll);
router.post('/bulk-generate', authorize('admin', 'hr'), bulkGeneratePayroll);
router.put('/:id', authorize('admin', 'hr'), updatePayroll);
router.put('/:id/process', authorize('admin', 'hr'), processPayroll);
router.put('/:id/mark-paid', authorize('admin', 'hr'), markPayrollAsPaid);

export default router;