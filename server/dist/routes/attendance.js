"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Employee routes
router.post('/punch-in', attendanceController_1.punchIn);
router.post('/punch-out', attendanceController_1.punchOut);
router.get('/today', attendanceController_1.getTodayAttendance);
router.get('/history', attendanceController_1.getAttendanceHistory);
// HR/Admin routes
router.get('/report', (0, auth_1.authorize)('admin', 'hr'), attendanceController_1.getAttendanceReport);
router.get('/dashboard-stats', (0, auth_1.authorize)('admin', 'hr'), attendanceController_1.getDashboardStats);
router.put('/:id', (0, auth_1.authorize)('admin', 'hr'), attendanceController_1.updateAttendance);
exports.default = router;
//# sourceMappingURL=attendance.js.map