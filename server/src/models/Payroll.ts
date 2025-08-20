import mongoose, { Schema } from 'mongoose';
import { IPayroll } from '../types';

const payrollSchema = new Schema<IPayroll>({
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    pf: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  grossSalary: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  payDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate gross and net salary before saving
payrollSchema.pre('save', function(next) {
  const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
  const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
  
  this.grossSalary = this.basicSalary + totalAllowances;
  this.netSalary = this.grossSalary - totalDeductions;
  
  next();
});

// Compound index for unique payroll per employee per month
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });

export default mongoose.model<IPayroll>('Payroll', payrollSchema);