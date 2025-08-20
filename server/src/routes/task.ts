import express from 'express';
import {
  createTask,
  getMyTasks,
  getAssignedTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats
} from '../controllers/taskController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/my-tasks', getMyTasks);
router.get('/assigned-tasks', getAssignedTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.post('/:id/comments', addComment);

// HR/Admin routes
router.get('/', authorize('admin', 'hr'), getAllTasks);
router.get('/stats/overview', authorize('admin', 'hr'), getTaskStats);
router.delete('/:id', deleteTask);

export default router;