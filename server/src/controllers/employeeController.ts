import { Request, Response } from 'express';
import Employee from '../models/Employee';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, department, role, status } = req.query;
    
    const query: any = {};
    
    // Build search query
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) query.department = department;
    if (role) query.role = role;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Employee.countDocuments(query);

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
  } catch (error: any) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error: any) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getEmployeeByUserId = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findOne({ userId: req.params.userId });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error: any) {
    console.error('Get employee by user ID error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employeeData = req.body;

    // Check if employee already exists with this email
    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists with this email' });
    }

    // Create user account if not exists
    let user = await User.findOne({ email: employeeData.email });
    if (!user) {
      user = new User({
        name: employeeData.fullName,
        email: employeeData.email,
        password: 'password123', // Default password - should be changed
        role: employeeData.role || 'employee',
        department: employeeData.department
      });
      await user.save();
    }

    // Create employee record
    const employee = new Employee({
      ...employeeData,
      userId: user._id
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error: any) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update corresponding user record
    await User.findByIdAndUpdate(employee.userId, {
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
  } catch (error: any) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Soft delete - mark as inactive
    employee.status = 'inactive';
    await employee.save();

    // Also deactivate user account
    await User.findByIdAndUpdate(employee.userId, { isActive: false });

    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Employee.distinct('department');
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error: any) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getDesignations = async (req: Request, res: Response) => {
  try {
    const designations = await Employee.distinct('designation');
    
    res.json({
      success: true,
      data: designations
    });
  } catch (error: any) {
    console.error('Get designations error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};