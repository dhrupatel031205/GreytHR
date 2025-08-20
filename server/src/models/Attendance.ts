import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../types';

const attendanceSchema = new Schema<IAttendance>({
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  date: {
    type: Date,
    required: true
  },
  punchIn: {
    type: Date
  },
  punchOut: {
    type: Date
  },
  breakTime: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'absent'
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Calculate total hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.punchIn && this.punchOut) {
    const timeDiff = this.punchOut.getTime() - this.punchIn.getTime();
    const hours = timeDiff / (1000 * 60 * 60);
    this.totalHours = Number((hours - (this.breakTime || 0) / 60).toFixed(2));
  }
  next();
});

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);