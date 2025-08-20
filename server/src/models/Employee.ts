import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../types';

const employeeSchema = new Schema<IEmployee>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    default: 'employee'
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  doj: {
    type: Date,
    required: [true, 'Date of joining is required']
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: [true, 'Account number is required']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required']
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  avatar: {
    type: String
  },
  documents: {
    idProof: String,
    resume: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeeSchema.index({ userId: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

export default mongoose.model<IEmployee>('Employee', employeeSchema);