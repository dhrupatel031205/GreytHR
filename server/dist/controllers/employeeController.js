"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesignations = exports.getDepartments = exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployeeByUserId = exports.getEmployeeById = exports.getAllEmployees = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const User_1 = __importDefault(require("../models/User"));
const getAllEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, department, role, status } = req.query;
        const query = {};
        // Build search query
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } }
            ];
        }
        if (department)
            query.department = department;
        if (role)
            query.role = role;
        if (status)
            query.status = status;
        const employees = await Employee_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Employee_1.default.countDocuments(query);
        res.json({
            success: true,
            data: employees,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee_1.default.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({
            success: true,
            data: employee
        });
    }
    catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getEmployeeById = getEmployeeById;
const getEmployeeByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        // First try to find by userId (for backward compatibility)
        let employee = await Employee_1.default.findOne({ userId });
        // If not found by userId, try to find by email (for user switcher)
        if (!employee) {
            const user = await User_1.default.findOne({ email: userId });
            if (user) {
                employee = await Employee_1.default.findOne({ userId: user._id });
            }
        }
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({
            success: true,
            employee: employee
        });
    }
    catch (error) {
        console.error('Get employee by user ID error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getEmployeeByUserId = getEmployeeByUserId;
const createEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        // Check if employee already exists with this email
        const existingEmployee = await Employee_1.default.findOne({ email: employeeData.email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists with this email' });
        }
        // Create user account if not exists
        let user = await User_1.default.findOne({ email: employeeData.email });
        if (!user) {
            user = new User_1.default({
                name: employeeData.fullName,
                email: employeeData.email,
                password: 'password123', // Default password - should be changed
                role: employeeData.role || 'employee',
                department: employeeData.department
            });
            await user.save();
        }
        // Create employee record
        const employee = new Employee_1.default({
            ...employeeData,
            userId: user._id
        });
        await employee.save();
        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    }
    catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.createEmployee = createEmployee;
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Update corresponding user record
        await User_1.default.findByIdAndUpdate(employee.userId, {
            name: employee.fullName,
            email: employee.email,
            role: employee.role,
            department: employee.department
        });
        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    }
    catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee_1.default.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Soft delete - mark as inactive
        employee.status = 'inactive';
        await employee.save();
        // Also deactivate user account
        await User_1.default.findByIdAndUpdate(employee.userId, { isActive: false });
        res.json({
            success: true,
            message: 'Employee deactivated successfully'
        });
    }
    catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteEmployee = deleteEmployee;
const getDepartments = async (req, res) => {
    try {
        const departments = await Employee_1.default.distinct('department');
        res.json({
            success: true,
            data: departments
        });
    }
    catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getDepartments = getDepartments;
const getDesignations = async (req, res) => {
    try {
        const designations = await Employee_1.default.distinct('designation');
        res.json({
            success: true,
            data: designations
        });
    }
    catch (error) {
        console.error('Get designations error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getDesignations = getDesignations;
//# sourceMappingURL=employeeController.js.map