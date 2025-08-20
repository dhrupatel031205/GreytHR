"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayrollStats = exports.bulkGeneratePayroll = exports.markPayrollAsPaid = exports.processPayroll = exports.updatePayroll = exports.getPayrollById = exports.getAllPayrolls = exports.getPayrollByEmployee = exports.generatePayroll = void 0;
const Payroll_1 = __importDefault(require("../models/Payroll"));
const Employee_1 = __importDefault(require("../models/Employee"));
const generatePayroll = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
        // Check if payroll already exists for this employee and month
        const existingPayroll = await Payroll_1.default.findOne({ employeeId, month, year });
        if (existingPayroll) {
            return res.status(400).json({ message: 'Payroll already exists for this month' });
        }
        const payroll = new Payroll_1.default({
            employeeId,
            month,
            year,
            basicSalary,
            allowances: allowances || {
                hra: basicSalary * 0.4, // 40% HRA
                da: basicSalary * 0.1, // 10% DA
                transport: 2000,
                medical: 1500,
                other: 0
            },
            deductions: deductions || {
                pf: basicSalary * 0.12, // 12% PF
                esi: basicSalary * 0.0175, // 1.75% ESI
                tax: basicSalary * 0.1, // 10% Tax (simplified)
                other: 0
            }
        });
        await payroll.save();
        res.status(201).json({
            success: true,
            message: 'Payroll generated successfully',
            data: payroll
        });
    }
    catch (error) {
        console.error('Generate payroll error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.generatePayroll = generatePayroll;
const getPayrollByEmployee = async (req, res) => {
    try {
        const { page = 1, limit = 10, year } = req.query;
        // Get employee record
        const employee = await Employee_1.default.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee record not found' });
        }
        const query = { employeeId: employee._id };
        if (year)
            query.year = Number(year);
        const payrolls = await Payroll_1.default.find(query)
            .sort({ year: -1, month: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Payroll_1.default.countDocuments(query);
        res.json({
            success: true,
            data: payrolls,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get payroll by employee error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getPayrollByEmployee = getPayrollByEmployee;
const getAllPayrolls = async (req, res) => {
    try {
        const { page = 1, limit = 10, month, year, department, status } = req.query;
        const query = {};
        if (month)
            query.month = month;
        if (year)
            query.year = Number(year);
        if (status)
            query.status = status;
        let payrolls = await Payroll_1.default.find(query)
            .sort({ year: -1, month: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('employeeId', 'fullName email department designation');
        // Filter by department if specified
        if (department) {
            payrolls = payrolls.filter((payroll) => payroll.employeeId.department === department);
        }
        const total = await Payroll_1.default.countDocuments(query);
        res.json({
            success: true,
            data: payrolls,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get all payrolls error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAllPayrolls = getAllPayrolls;
const getPayrollById = async (req, res) => {
    try {
        const payroll = await Payroll_1.default.findById(req.params.id)
            .populate('employeeId', 'fullName email department designation phone bankDetails');
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        res.json({
            success: true,
            data: payroll
        });
    }
    catch (error) {
        console.error('Get payroll by ID error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getPayrollById = getPayrollById;
const updatePayroll = async (req, res) => {
    try {
        const { basicSalary, allowances, deductions, status } = req.body;
        const payroll = await Payroll_1.default.findByIdAndUpdate(req.params.id, { basicSalary, allowances, deductions, status }, { new: true, runValidators: true });
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        res.json({
            success: true,
            message: 'Payroll updated successfully',
            data: payroll
        });
    }
    catch (error) {
        console.error('Update payroll error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.updatePayroll = updatePayroll;
const processPayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll_1.default.findById(id);
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        if (payroll.status === 'paid') {
            return res.status(400).json({ message: 'Payroll already processed and paid' });
        }
        payroll.status = 'processed';
        payroll.payDate = new Date();
        await payroll.save();
        res.json({
            success: true,
            message: 'Payroll processed successfully',
            data: payroll
        });
    }
    catch (error) {
        console.error('Process payroll error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.processPayroll = processPayroll;
const markPayrollAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll_1.default.findById(id);
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        payroll.status = 'paid';
        if (!payroll.payDate) {
            payroll.payDate = new Date();
        }
        await payroll.save();
        res.json({
            success: true,
            message: 'Payroll marked as paid successfully',
            data: payroll
        });
    }
    catch (error) {
        console.error('Mark payroll as paid error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.markPayrollAsPaid = markPayrollAsPaid;
const bulkGeneratePayroll = async (req, res) => {
    try {
        const { month, year, basicSalaries } = req.body;
        if (!month || !year || !basicSalaries || !Array.isArray(basicSalaries)) {
            return res.status(400).json({ message: 'Month, year, and basic salaries array are required' });
        }
        const results = [];
        const errors = [];
        for (const { employeeId, basicSalary } of basicSalaries) {
            try {
                // Check if payroll already exists
                const existingPayroll = await Payroll_1.default.findOne({ employeeId, month, year });
                if (existingPayroll) {
                    errors.push({ employeeId, error: 'Payroll already exists for this month' });
                    continue;
                }
                const payroll = new Payroll_1.default({
                    employeeId,
                    month,
                    year,
                    basicSalary,
                    allowances: {
                        hra: basicSalary * 0.4,
                        da: basicSalary * 0.1,
                        transport: 2000,
                        medical: 1500,
                        other: 0
                    },
                    deductions: {
                        pf: basicSalary * 0.12,
                        esi: basicSalary * 0.0175,
                        tax: basicSalary * 0.1,
                        other: 0
                    }
                });
                await payroll.save();
                results.push(payroll);
            }
            catch (error) {
                errors.push({ employeeId, error: error.message });
            }
        }
        res.json({
            success: true,
            message: `Generated ${results.length} payrolls successfully`,
            data: {
                generated: results.length,
                errors: errors.length,
                details: { results, errors }
            }
        });
    }
    catch (error) {
        console.error('Bulk generate payroll error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.bulkGeneratePayroll = bulkGeneratePayroll;
const getPayrollStats = async (req, res) => {
    try {
        const { month, year } = req.query;
        const query = {};
        if (month)
            query.month = month;
        if (year)
            query.year = Number(year);
        // Get payroll statistics
        const stats = await Payroll_1.default.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalGross: { $sum: '$grossSalary' },
                    totalNet: { $sum: '$netSalary' }
                }
            }
        ]);
        // Get department-wise statistics
        const departmentStats = await Payroll_1.default.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $group: {
                    _id: '$employee.department',
                    count: { $sum: 1 },
                    totalGross: { $sum: '$grossSalary' },
                    totalNet: { $sum: '$netSalary' }
                }
            }
        ]);
        // Format statistics
        const formattedStats = {
            byStatus: { draft: 0, processed: 0, paid: 0 },
            byDepartment: {},
            totalEmployees: 0,
            totalGrossSalary: 0,
            totalNetSalary: 0
        };
        stats.forEach(stat => {
            formattedStats.byStatus[stat._id] = {
                count: stat.count,
                totalGross: stat.totalGross,
                totalNet: stat.totalNet
            };
            formattedStats.totalEmployees += stat.count;
            formattedStats.totalGrossSalary += stat.totalGross;
            formattedStats.totalNetSalary += stat.totalNet;
        });
        departmentStats.forEach(stat => {
            formattedStats.byDepartment[stat._id] = {
                count: stat.count,
                totalGross: stat.totalGross,
                totalNet: stat.totalNet
            };
        });
        res.json({
            success: true,
            data: formattedStats
        });
    }
    catch (error) {
        console.error('Get payroll stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getPayrollStats = getPayrollStats;
//# sourceMappingURL=payrollController.js.map