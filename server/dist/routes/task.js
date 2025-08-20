"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Employee routes
router.get('/my-tasks', taskController_1.getMyTasks);
router.get('/assigned-tasks', taskController_1.getAssignedTasks);
router.post('/', taskController_1.createTask);
router.get('/:id', taskController_1.getTaskById);
router.put('/:id', taskController_1.updateTask);
router.post('/:id/comments', taskController_1.addComment);
// HR/Admin routes
router.get('/', (0, auth_1.authorize)('admin', 'hr'), taskController_1.getAllTasks);
router.get('/stats/overview', (0, auth_1.authorize)('admin', 'hr'), taskController_1.getTaskStats);
router.delete('/:id', taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.js.map