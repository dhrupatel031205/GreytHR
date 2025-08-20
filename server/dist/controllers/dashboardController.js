"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeReport = exports.getPayrollReport = exports.getLeaveReport = exports.getAttendanceReport = exports.getDashboardStats = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Leave_1 = __importDefault(require("../models/Leave"));
const Task_1 = __importDefault(require("../models/Task"));
const Payroll_1 = __importDefault(require("../models/Payroll"));
const date_fns_1 = require("date-fns");
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        const startOfThisMonth = (0, date_fns_1.startOfMonth)(today);
        const endOfThisMonth = (0, date_fns_1.endOfMonth)(today);
        // Employee statistics
        const totalEmployees = await Employee_1.default.countDocuments({ status: 'active' });
        const newEmployeesThisMonth = await Employee_1.default.countDocuments({
            status: 'active',
            createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
        });
        // Attendance statistics
        const todayAttendance = await Attendance_1.default.aggregate([
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
        const attendanceStats = {
            present: 0,
            absent: 0,
            late: 0,
            'half-day': 0
        };
        todayAttendance.forEach(stat => {
            attendanceStats[stat._id] = stat.count;
        });
        // Leave statistics
        const pendingLeaves = await Leave_1.default.countDocuments({ status: 'pending' });
        const approvedLeavesToday = await Leave_1.default.countDocuments({
            status: 'approved',
            startDate: { $lte: endOfToday },
            endDate: { $gte: startOfToday }
        });
        // Task statistics
        const taskStats = await Task_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const taskStatistics = {
            todo: 0,
            'in-progress': 0,
            review: 0,
            completed: 0
        };
        taskStats.forEach(stat => {
            taskStatistics[stat._id] = stat.count;
        });
        // Payroll statistics
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const payrollStats = await Payroll_1.default.aggregate([
            {
                $match: {
                    month: currentMonth.toString().padStart(2, '0'),
                    year: currentYear
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$netSalary' }
                }
            }
        ]);
        const payrollStatistics = {
            draft: { count: 0, amount: 0 },
            processed: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 }
        };
        payrollStats.forEach(stat => {
            payrollStatistics[stat._id] = {
                count: stat.count,
                amount: stat.totalAmount
            };
        });
        // Recent activities (last 7 days)
        const last7Days = (0, date_fns_1.subDays)(today, 7);
        const recentActivities = {
            newEmployees: await Employee_1.default.countDocuments({
                createdAt: { $gte: last7Days },
                status: 'active'
            }),
            completedTasks: await Task_1.default.countDocuments({
                updatedAt: { $gte: last7Days },
                status: 'completed'
            }),
            approvedLeaves: await Leave_1.default.countDocuments({
                approvedOn: { $gte: last7Days },
                status: 'approved'
            })
        };
        res.json({
            success: true,
            data: {
                employees: {
                    total: totalEmployees,
                    newThisMonth: newEmployeesThisMonth
                },
                attendance: {
                    today: attendanceStats,
                    presentToday: attendanceStats.present,
                    totalToday: Object.values(attendanceStats).reduce((sum, count) => sum + count, 0)
                },
                leaves: {
                    pending: pendingLeaves,
                    onLeaveToday: approvedLeavesToday
                },
                tasks: taskStatistics,
                payroll: {
                    thisMonth: payrollStatistics,
                    totalPayroll: Object.values(payrollStatistics).reduce((sum, stat) => sum + stat.amount, 0)
                },
                recentActivities
            }
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, department, employeeId } = req.query;
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
        // Filter by department or employee if specified
        if (department) {
            attendanceData = attendanceData.filter((record) => record.employeeId.department === department);
        }
        if (employeeId) {
            attendanceData = attendanceData.filter((record) => record.employeeId._id.toString() === employeeId);
        }
        // Calculate summary statistics
        const summary = {
            totalRecords: attendanceData.length,
            present: attendanceData.filter(record => record.status === 'present').length,
            absent: attendanceData.filter(record => record.status === 'absent').length,
            late: attendanceData.filter(record => record.status === 'late').length,
            halfDay: attendanceData.filter(record => record.status === 'half-day').length,
            averageHours: attendanceData.length > 0
                ? (attendanceData.reduce((sum, record) => sum + (record.totalHours || 0), 0) / attendanceData.length).toFixed(2)
                : 0
        };
        res.json({
            success: true,
            data: {
                records: attendanceData,
                summary
            }
        });
    }
    catch (error) {
        console.error('Get attendance report error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAttendanceReport = getAttendanceReport;
const getLeaveReport = async (req, res) => {
    try {
        const { startDate, endDate, department, status, type } = req.query;
        const query = {};
        if (startDate && endDate) {
            query.startDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (status)
            query.status = status;
        if (type)
            query.type = type;
        let leaveData = await Leave_1.default.find(query)
            .populate('employeeId', 'fullName email department designation')
            .populate('approvedBy', 'name email')
            .sort({ startDate: -1 });
        // Filter by department if specified
        if (department) {
            leaveData = leaveData.filter((record) => record.employeeId.department === department);
        }
        // Calculate summary statistics
        const summary = {
            totalApplications: leaveData.length,
            approved: leaveData.filter(record => record.status === 'approved').length,
            pending: leaveData.filter(record => record.status === 'pending').length,
            rejected: leaveData.filter(record => record.status === 'rejected').length,
            totalDays: leaveData.reduce((sum, record) => sum + record.days, 0),
            byType: {
                casual: leaveData.filter(record => record.type === 'casual').length,
                sick: leaveData.filter(record => record.type === 'sick').length,
                earned: leaveData.filter(record => record.type === 'earned').length,
                maternity: leaveData.filter(record => record.type === 'maternity').length,
                paternity: leaveData.filter(record => record.type === 'paternity').length
            }
        };
        res.json({
            success: true,
            data: {
                records: leaveData,
                summary
            }
        });
    }
    catch (error) {
        console.error('Get leave report error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getLeaveReport = getLeaveReport;
const getPayrollReport = async (req, res) => {
    try {
        const { month, year, department, status } = req.query;
        const query = {};
        if (month)
            query.month = month;
        if (year)
            query.year = Number(year);
        if (status)
            query.status = status;
        let payrollData = await Payroll_1.default.find(query)
            .populate('employeeId', 'fullName email department designation')
            .sort({ year: -1, month: -1 });
        // Filter by department if specified
        if (department) {
            payrollData = payrollData.filter((record) => record.employeeId.department === department);
        }
        // Calculate summary statistics
        const summary = {
            totalRecords: payrollData.length,
            totalGrossSalary: payrollData.reduce((sum, record) => sum + record.grossSalary, 0),
            totalNetSalary: payrollData.reduce((sum, record) => sum + record.netSalary, 0),
            totalDeductions: payrollData.reduce((sum, record) => {
                const deductions = Object.values(record.deductions).reduce((deductionSum, val) => deductionSum + val, 0);
                return sum + deductions;
            }, 0),
            byStatus: {
                draft: payrollData.filter(record => record.status === 'draft').length,
                processed: payrollData.filter(record => record.status === 'processed').length,
                paid: payrollData.filter(record => record.status === 'paid').length
            }
        };
        res.json({
            success: true,
            data: {
                records: payrollData,
                summary
            }
        });
    }
    catch (error) {
        console.error('Get payroll report error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getPayrollReport = getPayrollReport;
const getEmployeeReport = async (req, res) => {
    try {
        const { department, status, role } = req.query;
        const query = {};
        if (department)
            query.department = department;
        if (status)
            query.status = status;
        if (role)
            query.role = role;
        const employees = await Employee_1.default.find(query)
            .sort({ createdAt: -1 });
        // Calculate summary statistics
        const summary = {
            totalEmployees: employees.length,
            byDepartment: {},
            byRole: {
                admin: employees.filter(emp => emp.role === 'admin').length,
                hr: employees.filter(emp => emp.role === 'hr').length,
                employee: employees.filter(emp => emp.role === 'employee').length
            },
            byStatus: {
                active: employees.filter(emp => emp.status === 'active').length,
                inactive: employees.filter(emp => emp.status === 'inactive').length
            },
            averageAge: 0
        };
        // Calculate department statistics
        const departments = [...new Set(employees.map(emp => emp.department))];
        departments.forEach(dept => {
            summary.byDepartment[dept] = employees.filter(emp => emp.department === dept).length;
        });
        // Calculate average age
        const currentYear = new Date().getFullYear();
        const ages = employees.map(emp => currentYear - new Date(emp.dob).getFullYear());
        summary.averageAge = ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
        res.json({
            success: true,
            data: {
                records: employees,
                summary
            }
        });
    }
    catch (error) {
        console.error('Get employee report error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getEmployeeReport = getEmployeeReport;
//# sourceMappingURL=dashboardController.js.map