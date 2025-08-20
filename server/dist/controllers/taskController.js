"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.addComment = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.getAssignedTasks = exports.getMyTasks = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Notification_1 = __importDefault(require("../models/Notification"));
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate, tags } = req.body;
        // Get assigner employee record
        const assignerEmployee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!assignerEmployee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Verify assigned employee exists
        const assignedEmployee = await Employee_1.default.findById(assignedTo);
        if (!assignedEmployee) {
            return res.status(404).json({ message: 'Assigned employee not found' });
        }
        const task = new Task_1.default({
            title,
            description,
            assignedTo,
            assignedBy: assignerEmployee._id,
            priority: priority || 'medium',
            dueDate: new Date(dueDate),
            tags: tags || []
        });
        await task.save();
        // Create notification for assigned employee
        await Notification_1.default.create({
            userId: assignedEmployee.userId,
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${title}`,
            type: 'info',
            data: { taskId: task._id }
        });
        // Populate the task before sending response
        await task.populate('assignedTo', 'fullName email department');
        await task.populate('assignedBy', 'fullName email department');
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    }
    catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.createTask = createTask;
const getMyTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, search } = req.query;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const query = { assignedTo: employee._id };
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const tasks = await Task_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email department');
        const total = await Task_1.default.countDocuments(query);
        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get my tasks error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getMyTasks = getMyTasks;
const getAssignedTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, search } = req.query;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const query = { assignedBy: employee._id };
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const tasks = await Task_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email department');
        const total = await Task_1.default.countDocuments(query);
        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get assigned tasks error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAssignedTasks = getAssignedTasks;
const getAllTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, assignedTo, assignedBy, search } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (assignedTo)
            query.assignedTo = assignedTo;
        if (assignedBy)
            query.assignedBy = assignedBy;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const tasks = await Task_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email department');
        const total = await Task_1.default.countDocuments(query);
        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await Task_1.default.findById(req.params.id)
            .populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email department')
            .populate('comments.userId', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({
            success: true,
            data: task
        });
    }
    catch (error) {
        console.error('Get task by ID error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, tags } = req.body;
        const task = await Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Get employee record to check permissions
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Check if user can update this task (assigned to them or assigned by them)
        if (task.assignedTo.toString() !== employee._id.toString() &&
            task.assignedBy.toString() !== employee._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }
        // Update task
        const updatedTask = await Task_1.default.findByIdAndUpdate(req.params.id, { title, description, priority, status, dueDate, tags }, { new: true, runValidators: true }).populate('assignedBy', 'fullName email department')
            .populate('assignedTo', 'fullName email department');
        // Create notification if status changed
        if (status && status !== task.status) {
            const targetUserId = task.assignedBy.toString() === employee._id.toString()
                ? (await Employee_1.default.findById(task.assignedTo)).userId
                : (await Employee_1.default.findById(task.assignedBy)).userId;
            await Notification_1.default.create({
                userId: targetUserId,
                title: 'Task Status Updated',
                message: `Task "${task.title}" status changed to ${status}`,
                type: 'info',
                data: { taskId: task._id }
            });
        }
        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    }
    catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Get employee record to check permissions
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Check if user can delete this task (only assigned by them or admin/hr)
        if (task.assignedBy.toString() !== employee._id.toString() &&
            !['admin', 'hr'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }
        await Task_1.default.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteTask = deleteTask;
const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const taskId = req.params.id;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Add comment
        task.comments.push({
            userId: req.user._id,
            comment,
            timestamp: new Date()
        });
        await task.save();
        // Populate the updated task
        await task.populate('comments.userId', 'name email');
        res.json({
            success: true,
            message: 'Comment added successfully',
            data: task
        });
    }
    catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.addComment = addComment;
const getTaskStats = async (req, res) => {
    try {
        // Get task statistics
        const stats = await Task_1.default.aggregate([
            {
                $group: {
                    _id: {
                        status: '$status',
                        priority: '$priority'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        // Format statistics
        const formattedStats = {
            byStatus: { todo: 0, 'in-progress': 0, review: 0, completed: 0 },
            byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
            totalTasks: 0
        };
        stats.forEach(stat => {
            formattedStats.byStatus[stat._id.status] += stat.count;
            formattedStats.byPriority[stat._id.priority] += stat.count;
            formattedStats.totalTasks += stat.count;
        });
        // Get overdue tasks count
        const overdueTasks = await Task_1.default.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $nin: ['completed'] }
        });
        formattedStats['overdue'] = overdueTasks;
        res.json({
            success: true,
            data: formattedStats
        });
    }
    catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getTaskStats = getTaskStats;
//# sourceMappingURL=taskController.js.map