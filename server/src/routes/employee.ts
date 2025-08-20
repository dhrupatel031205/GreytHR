import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByUserId,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  getDesignations
} from '../controllers/employeeController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all employees (with filtering and pagination)
router.get('/', getAllEmployees);

// Get departments and designations
router.get('/departments', getDepartments);
router.get('/designations', getDesignations);

// Get employee by user ID
router.get('/user/:userId', getEmployeeByUserId);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Create employee (HR/Admin only)
router.post('/', authorize('admin', 'hr'), createEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee (HR/Admin only)
router.delete('/:id', authorize('admin', 'hr'), deleteEmployee);

export default router;