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
const leaveSchema = new mongoose_1.Schema({
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
leaveSchema.pre('save', function (next) {
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
exports.default = mongoose_1.default.model('Leave', leaveSchema);
//# sourceMappingURL=Leave.js.map