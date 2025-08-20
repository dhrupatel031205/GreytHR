const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    default: 'employee'
  },
  department: {
    type: String,
    required: true
  },
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  doj: {
    type: Date,
    required: true
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  avatar: String,
  documents: {
    idProof: String,
    resume: String
  }
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Employee = mongoose.model('Employee', employeeSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GreytHR Demo Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get all available users for switcher
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('name email role department');
    
    // Map to frontend format
    const userMapping = {
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
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific user by ID
app.get('/api/auth/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Map frontend user IDs to actual database user emails
    const userMapping = {
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
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get employee by user ID (email)
app.get('/api/employee/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employee = await Employee.findOne({ userId: user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      success: true,
      employee: employee
    });
  } catch (error) {
    console.error('Get employee by user ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GreytHR Demo Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`👥 Employee API: http://localhost:${PORT}/api/employee`);
});