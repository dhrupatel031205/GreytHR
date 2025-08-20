"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.updateAttendance = exports.getAttendanceReport = exports.getAttendanceHistory = exports.getTodayAttendance = exports.punchOut = exports.punchIn = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Employee_1 = __importDefault(require("../models/Employee"));
const date_fns_1 = require("date-fns");
const punchIn = async (req, res) => {
    try {
        const { location, notes } = req.body;
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Check if already punched in today
        const existingAttendance = await Attendance_1.default.findOne({
            employeeId: employee._id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        if (existingAttendance && existingAttendance.punchIn) {
            return res.status(400).json({ message: 'Already punched in today' });
        }
        // Create or update attendance record
        const attendanceData = {
            employeeId: employee._id,
            date: startOfToday,
            punchIn: today,
            status: 'present',
            location,
            notes
        };
        const attendance = existingAttendance
            ? await Attendance_1.default.findByIdAndUpdate(existingAttendance._id, attendanceData, { new: true })
            : await Attendance_1.default.create(attendanceData);
        res.json({
            success: true,
            message: 'Punched in successfully',
            data: attendance
        });
    }
    catch (error) {
        console.error('Punch in error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.punchIn = punchIn;
const punchOut = async (req, res) => {
    try {
        const { location, notes } = req.body;
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        // Find today's attendance record
        const attendance = await Attendance_1.default.findOne({
            employeeId: employee._id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        if (!attendance || !attendance.punchIn) {
            return res.status(400).json({ message: 'Please punch in first' });
        }
        if (attendance.punchOut) {
            return res.status(400).json({ message: 'Already punched out today' });
        }
        // Update attendance with punch out
        attendance.punchOut = today;
        if (location)
            attendance.location = location;
        if (notes)
            attendance.notes = notes;
        await attendance.save();
        res.json({
            success: true,
            message: 'Punched out successfully',
            data: attendance
        });
    }
    catch (error) {
        console.error('Punch out error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.punchOut = punchOut;
const getTodayAttendance = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const attendance = await Attendance_1.default.findOne({
            employeeId: employee._id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        res.json({
            success: true,
            data: attendance
        });
    }
    catch (error) {
        console.error('Get today attendance error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getTodayAttendance = getTodayAttendance;
const getAttendanceHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, month, year, employeeId } = req.query;
        // Get employee record
        let targetEmployeeId = employeeId;
        if (!targetEmployeeId) {
            const employee = await Employee_1.default.findOne({ userId: req.user._id });
            if (!employee) {
                return res.status(404).json({ message: 'Employee record not found' });
            }
            targetEmployeeId = employee._id;
        }
        const query = { employeeId: targetEmployeeId };
        // Filter by month/year if provided
        if (month && year) {
            const startDate = (0, date_fns_1.startOfMonth)(new Date(Number(year), Number(month) - 1));
            const endDate = (0, date_fns_1.endOfMonth)(new Date(Number(year), Number(month) - 1));
            query.date = { $gte: startDate, $lte: endDate };
        }
        const attendance = await Attendance_1.default.find(query)
            .sort({ date: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('employeeId', 'fullName email department');
        const total = await Attendance_1.default.countDocuments(query);
        res.json({
            success: true,
            data: attendance,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get attendance history error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAttendanceHistory = getAttendanceHistory;
const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, department } = req.query;
        const query = {};
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        let attendanceData = await Attendance_1.default.find(query)
            .populate('employeeId', 'fullName email department designation')
            .sort({ date: -1 });
        // Filter by department if specified
        if (department) {
            attendanceData = attendanceData.filter((record) => record.employeeId.department === department);
        }
        // Calculate statistics
        const totalRecords = attendanceData.length;
        const presentCount = attendanceData.filter(record => record.status === 'present').length;
        const absentCount = attendanceData.filter(record => record.status === 'absent').length;
        const lateCount = attendanceData.filter(record => record.status === 'late').length;
        const stats = {
            total: totalRecords,
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            presentPercentage: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0
        };
        res.json({
            success: true,
            data: attendanceData,
            stats
        });
    }
    catch (error) {
        console.error('Get attendance report error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAttendanceReport = getAttendanceReport;
const updateAttendance = async (req, res) => {
    try {
        const { status, punchIn, punchOut, breakTime, notes } = req.body;
        const attendance = await Attendance_1.default.findByIdAndUpdate(req.params.id, { status, punchIn, punchOut, breakTime, notes }, { new: true, runValidators: true });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendance
        });
    }
    catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.updateAttendance = updateAttendance;
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        // Today's attendance stats
        const todayStats = await Attendance_1.default.aggregate([
            {
                $match: {
                    date: { $gte: startOfToday, $lte: endOfToday }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        // Monthly attendance stats
        const startOfThisMonth = (0, date_fns_1.startOfMonth)(today);
        const endOfThisMonth = (0, date_fns_1.endOfMonth)(today);
        const monthlyStats = await Attendance_1.default.aggregate([
            {
                $match: {
                    date: { $gte: startOfThisMonth, $lte: endOfThisMonth }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        // Format stats
        const formatStats = (stats) => {
            const result = { present: 0, absent: 0, late: 0, 'half-day': 0 };
            stats.forEach(stat => {
                result[stat._id] = stat.count;
            });
            return result;
        };
        res.json({
            success: true,
            data: {
                today: formatStats(todayStats),
                thisMonth: formatStats(monthlyStats)
            }
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=attendanceController.js.map