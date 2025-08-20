"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Employee routes
router.post('/apply', leaveController_1.applyLeave);
router.get('/my-leaves', leaveController_1.getMyLeaves);
router.get('/balance', leaveController_1.getLeaveBalance);
router.delete('/:id', leaveController_1.cancelLeave);
// HR/Admin routes
router.get('/all', (0, auth_1.authorize)('admin', 'hr'), leaveController_1.getAllLeaves);
router.put('/:id/approve', (0, auth_1.authorize)('admin', 'hr'), leaveController_1.approveLeave);
router.get('/stats', (0, auth_1.authorize)('admin', 'hr'), leaveController_1.getLeaveStats);
exports.default = router;
//# sourceMappingURL=leave.js.map