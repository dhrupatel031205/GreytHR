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
const attendanceSchema = new mongoose_1.Schema({
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
attendanceSchema.pre('save', function (next) {
    if (this.punchIn && this.punchOut) {
        const timeDiff = this.punchOut.getTime() - this.punchIn.getTime();
        const hours = timeDiff / (1000 * 60 * 60);
        this.totalHours = Number((hours - (this.breakTime || 0) / 60).toFixed(2));
    }
    next();
});
exports.default = mongoose_1.default.model('Attendance', attendanceSchema);
//# sourceMappingURL=Attendance.js.map