"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const payrollSchema = new mongoose_1.Schema({
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
payrollSchema.pre('save', function (next) {
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    this.grossSalary = this.basicSalary + totalAllowances;
    this.netSalary = this.grossSalary - totalDeductions;
    next();
});
// Compound index for unique payroll per employee per month
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });
exports.default = mongoose_1.default.model('Payroll', payrollSchema);
//# sourceMappingURL=Payroll.js.map