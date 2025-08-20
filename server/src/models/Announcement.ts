import mongoose, { Schema } from 'mongoose';
import { IAnnouncement } from '../types';

const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: String,
    required: true,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'department', 'role'],
    default: 'all'
  },
  targetValue: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  },
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ targetAudience: 1, targetValue: 1 });
announcementSchema.index({ createdAt: -1 });

export default mongoose.model<IAnnouncement>('Announcement', announcementSchema);