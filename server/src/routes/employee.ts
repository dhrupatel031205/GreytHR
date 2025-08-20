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

const router = express.Router();

// Get all employees (with filtering and pagination)
router.get('/', getAllEmployees);

// Get departments and designations
router.get('/departments', getDepartments);
router.get('/designations', getDesignations);

// Get employee by user ID (for user switcher)
router.get('/user/:userId', getEmployeeByUserId);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Create employee
router.post('/', createEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

export default router;