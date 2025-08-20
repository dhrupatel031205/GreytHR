"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Dashboard stats (accessible to all authenticated users)
router.get('/stats', dashboardController_1.getDashboardStats);
// Reports (HR/Admin only)
router.get('/reports/attendance', (0, auth_1.authorize)('admin', 'hr'), dashboardController_1.getAttendanceReport);
router.get('/reports/leave', (0, auth_1.authorize)('admin', 'hr'), dashboardController_1.getLeaveReport);
router.get('/reports/payroll', (0, auth_1.authorize)('admin', 'hr'), dashboardController_1.getPayrollReport);
router.get('/reports/employee', (0, auth_1.authorize)('admin', 'hr'), dashboardController_1.getEmployeeReport);
exports.default = router;
//# sourceMappingURL=dashboard.js.map