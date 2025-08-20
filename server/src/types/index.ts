import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployee extends Document {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'hr' | 'employee';
  address: string;
  department: string;
  designation: string;
  doj: Date;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'active' | 'inactive';
  avatar?: string;
  documents?: {
    idProof?: string;
    resume?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance extends Document {
  _id: string;
  employeeId: string;
  date: Date;
  punchIn?: Date;
  punchOut?: Date;
  breakTime?: number; // in minutes
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeave extends Document {
  _id: string;
  employeeId: string;
  type: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: Date;
  approvedBy?: string;
  approvedOn?: Date;
  rejectionReason?: string;
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayroll extends Document {
  _id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    hra: number;
    da: number;
    transport: number;
    medical: number;
    other: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    other: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  payDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: Date;
  tags?: string[];
  attachments?: string[];
  comments?: {
    userId: string;
    comment: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncement extends Document {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'department' | 'role';
  targetValue?: string;
  isActive: boolean;
  expiryDate?: Date;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat extends Document {
  _id: string;
  participants: string[];
  lastMessage?: {
    sender: string;
    content: string;
    timestamp: Date;
  };
  isGroup: boolean;
  groupName?: string;
  groupAdmin?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  _id: string;
  chatId: string;
  sender: string;
  content: string;
  messageType: 'text' | 'file' | 'image';
  fileUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}