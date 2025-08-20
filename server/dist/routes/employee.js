"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Get all employees (with filtering and pagination)
router.get('/', employeeController_1.getAllEmployees);
// Get departments and designations
router.get('/departments', employeeController_1.getDepartments);
router.get('/designations', employeeController_1.getDesignations);
// Get employee by user ID
router.get('/user/:userId', employeeController_1.getEmployeeByUserId);
// Get employee by ID
router.get('/:id', employeeController_1.getEmployeeById);
// Create employee (HR/Admin only)
router.post('/', (0, auth_1.authorize)('admin', 'hr'), employeeController_1.createEmployee);
// Update employee
router.put('/:id', employeeController_1.updateEmployee);
// Delete employee (HR/Admin only)
router.delete('/:id', (0, auth_1.authorize)('admin', 'hr'), employeeController_1.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employee.js.map