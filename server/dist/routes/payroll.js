"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Employee routes
router.get('/my-payroll', payrollController_1.getPayrollByEmployee);
// HR/Admin routes
router.get('/all', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.getAllPayrolls);
router.get('/stats', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.getPayrollStats);
router.get('/:id', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.getPayrollById);
router.post('/generate', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.generatePayroll);
router.post('/bulk-generate', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.bulkGeneratePayroll);
router.put('/:id', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.updatePayroll);
router.put('/:id/process', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.processPayroll);
router.put('/:id/mark-paid', (0, auth_1.authorize)('admin', 'hr'), payrollController_1.markPayrollAsPaid);
exports.default = router;
//# sourceMappingURL=payroll.js.map