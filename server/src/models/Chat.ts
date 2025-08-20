import mongoose, { Schema } from 'mongoose';
import { IChat, IMessage } from '../types';

const chatSchema = new Schema<IChat>({
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

const messageSchema = new Schema<IMessage>({
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

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
export const Message = mongoose.model<IMessage>('Message', messageSchema);