import mongoose, { Schema } from 'mongoose';
import { ILeave } from '../types';

const leaveSchema = new Schema<ILeave>({
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  type: {
    type: String,
    enum: ['casual', 'sick', 'earned', 'maternity', 'paternity'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  days: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedOn: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: String,
    ref: 'User'
  },
  approvedOn: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  documents: [{
    type: String
  }]
}, {
  timestamps: true
});

// Calculate days before saving
leaveSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    this.days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

// Indexes
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<ILeave>('Leave', leaveSchema);