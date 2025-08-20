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
exports.Message = exports.Chat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const chatSchema = new mongoose_1.Schema({
    participants: [{
            type: String,
            ref: 'User',
            required: true
        }],
    lastMessage: {
        sender: {
            type: String,
            ref: 'User'
        },
        content: String,
        timestamp: Date
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        trim: true
    },
    groupAdmin: {
        type: String,
        ref: 'User'
    }
}, {
    timestamps: true
});
const messageSchema = new mongoose_1.Schema({
    chatId: {
        type: String,
        required: true,
        ref: 'Chat'
    },
    sender: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: [true, 'Message content is required']
    },
    messageType: {
        type: String,
        enum: ['text', 'file', 'image'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
exports.Chat = mongoose_1.default.model('Chat', chatSchema);
exports.Message = mongoose_1.default.model('Message', messageSchema);
//# sourceMappingURL=Chat.js.map