"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaveStats = exports.getLeaveBalance = exports.cancelLeave = exports.approveLeave = exports.getAllLeaves = exports.getMyLeaves = exports.applyLeave = void 0;
const Leave_1 = __importDefault(require("../models/Leave"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Notification_1 = __importDefault(require("../models/Notification"));
const applyLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, reason, documents } = req.body;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Check for overlapping leaves
        const overlappingLeave = await Leave_1.default.findOne({
            employeeId: employee._id,
            status: { $in: ['pending', 'approved'] },
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });
        if (overlappingLeave) {
            return res.status(400).json({ message: 'You have overlapping leave requests' });
        }
        const leave = new Leave_1.default({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            documents: documents || []
        });
        await leave.save();
        // Create notification for HR/Admin
        const hrEmployees = await Employee_1.default.find({ role: { $in: ['hr', 'admin'] } });
        for (const hrEmployee of hrEmployees) {
            await Notification_1.default.create({
                userId: hrEmployee.userId,
                title: 'New Leave Application',
                message: `${employee.fullName} has applied for ${type} leave from ${startDate} to ${endDate}`,
                type: 'info',
                data: { leaveId: leave._id, employeeId: employee._id }
            });
        }
        res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            data: leave
        });
    }
    catch (error) {
        console.error('Apply leave error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.applyLeave = applyLeave;
const getMyLeaves = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, type } = req.query;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const query = { employeeId: employee._id };
        if (status)
            query.status = status;
        if (type)
            query.type = type;
        const leaves = await Leave_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('approvedBy', 'name');
        const total = await Leave_1.default.countDocuments(query);
        res.json({
            success: true,
            data: leaves,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get my leaves error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getMyLeaves = getMyLeaves;
const getAllLeaves = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, type, employeeId, department } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (type)
            query.type = type;
        if (employeeId)
            query.employeeId = employeeId;
        let leaves = await Leave_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('employeeId', 'fullName email department designation')
            .populate('approvedBy', 'name');
        // Filter by department if specified
        if (department) {
            leaves = leaves.filter((leave) => leave.employeeId.department === department);
        }
        const total = await Leave_1.default.countDocuments(query);
        res.json({
            success: true,
            data: leaves,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get all leaves error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAllLeaves = getAllLeaves;
const approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
        }
        const leave = await Leave_1.default.findById(id).populate('employeeId', 'fullName userId');
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'Leave request has already been processed' });
        }
        leave.status = status;
        leave.approvedBy = req.user._id;
        leave.approvedOn = new Date();
        if (status === 'rejected' && rejectionReason) {
            leave.rejectionReason = rejectionReason;
        }
        await leave.save();
        // Create notification for employee
        await Notification_1.default.create({
            userId: leave.employeeId.userId,
            title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your ${leave.type} leave request has been ${status}${status === 'rejected' && rejectionReason ? `: ${rejectionReason}` : ''}`,
            type: status === 'approved' ? 'success' : 'error',
            data: { leaveId: leave._id }
        });
        res.json({
            success: true,
            message: `Leave request ${status} successfully`,
            data: leave
        });
    }
    catch (error) {
        console.error('Approve leave error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.approveLeave = approveLeave;
const cancelLeave = async (req, res) => {
    try {
        const { id } = req.params;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const leave = await Leave_1.default.findOne({ _id: id, employeeId: employee._id });
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending leave requests' });
        }
        await Leave_1.default.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Leave request cancelled successfully'
        });
    }
    catch (error) {
        console.error('Cancel leave error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.cancelLeave = cancelLeave;
const getLeaveBalance = async (req, res) => {
    try {
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const currentYear = new Date().getFullYear();
        // Get approved leaves for current year
        const approvedLeaves = await Leave_1.default.find({
            employeeId: employee._id,
            status: 'approved',
            startDate: {
                $gte: new Date(currentYear, 0, 1),
                $lte: new Date(currentYear, 11, 31)
            }
        });
        // Calculate used leaves by type
        const usedLeaves = approvedLeaves.reduce((acc, leave) => {
            acc[leave.type] = (acc[leave.type] || 0) + leave.days;
            return acc;
        }, {});
        // Standard leave allocations (can be made configurable)
        const leaveAllocations = {
            casual: 12,
            sick: 10,
            earned: 15,
            maternity: 180,
            paternity: 15
        };
        const leaveBalance = Object.keys(leaveAllocations).reduce((acc, type) => {
            const allocated = leaveAllocations[type];
            const used = usedLeaves[type] || 0;
            acc[type] = {
                allocated,
                used,
                remaining: Math.max(0, allocated - used)
            };
            return acc;
        }, {});
        res.json({
            success: true,
            data: leaveBalance
        });
    }
    catch (error) {
        console.error('Get leave balance error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getLeaveBalance = getLeaveBalance;
const getLeaveStats = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        // Get leave statistics
        const stats = await Leave_1.default.aggregate([
            {
                $match: {
                    startDate: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        status: '$status',
                        type: '$type'
                    },
                    count: { $sum: 1 },
                    totalDays: { $sum: '$days' }
                }
            }
        ]);
        // Format statistics
        const formattedStats = {
            byStatus: { pending: 0, approved: 0, rejected: 0 },
            byType: { casual: 0, sick: 0, earned: 0, maternity: 0, paternity: 0 },
            totalLeaves: 0,
            totalDays: 0
        };
        stats.forEach(stat => {
            formattedStats.byStatus[stat._id.status] += stat.count;
            formattedStats.byType[stat._id.type] += stat.count;
            formattedStats.totalLeaves += stat.count;
            formattedStats.totalDays += stat.totalDays;
        });
        res.json({
            success: true,
            data: formattedStats
        });
    }
    catch (error) {
        console.error('Get leave stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getLeaveStats = getLeaveStats;
//# sourceMappingURL=leaveController.js.map