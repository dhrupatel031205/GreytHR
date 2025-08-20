import { Request, Response } from 'express';
import User from '../models/User';
import Employee from '../models/Employee';
import { generateToken } from '../utils/jwt';

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || 'employee',
      department
    });

    await user.save();

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// New endpoint for user switcher - returns user data by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Map frontend user IDs to actual database user IDs
    const userMapping: { [key: string]: string } = {
      'admin-user': 'admin@greyhr.com',
      'hr-user': 'hr@greyhr.com',
      'employee-user': 'employee@greyhr.com',
      'jane-user': 'jane.smith@greyhr.com',
      'mike-user': 'mike.johnson@greyhr.com'
    };

    const email = userMapping[userId];
    if (!email) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: userId, // Return the frontend ID
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all available users for switcher
export const getAvailableUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isActive: true }).select('name email role department');
    
    // Map to frontend format
    const userMapping: { [key: string]: string } = {
      'admin@greyhr.com': 'admin-user',
      'hr@greyhr.com': 'hr-user',
      'employee@greyhr.com': 'employee-user',
      'jane.smith@greyhr.com': 'jane-user',
      'mike.johnson@greyhr.com': 'mike-user'
    };

    const mappedUsers = users.map(user => ({
      _id: userMapping[user.email] || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    }));

    res.json({
      success: true,
      users: mappedUsers
    });
  } catch (error: any) {
    console.error('Get available users error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, department, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};