import { Request, Response } from 'express';
import Announcement from '../models/Announcement';
import Employee from '../models/Employee';
import Notification from '../models/Notification';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, priority, targetAudience, targetValue, expiryDate, attachments } = req.body;

    const announcement = new Announcement({
      title,
      content,
      author: req.user._id,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      targetValue,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      attachments: attachments || []
    });

    await announcement.save();

    // Create notifications for targeted users
    let targetUsers = [];

    if (targetAudience === 'all') {
      targetUsers = await User.find({ isActive: true });
    } else if (targetAudience === 'department' && targetValue) {
      targetUsers = await User.find({ department: targetValue, isActive: true });
    } else if (targetAudience === 'role' && targetValue) {
      targetUsers = await User.find({ role: targetValue, isActive: true });
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(user => ({
      userId: user._id,
      title: `New Announcement: ${title}`,
      message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      type: priority === 'high' ? 'warning' : 'info',
      data: { announcementId: announcement._id }
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Populate author before sending response
    await announcement.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error: any) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, priority, targetAudience, search, includeExpired = false } = req.query;

    const query: any = { isActive: true };

    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = targetAudience;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Exclude expired announcements unless specifically requested
    if (includeExpired !== 'true') {
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ];
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('author', 'name email');

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get all announcements error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAnnouncementsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, priority } = req.query;

    const query: any = {
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    };

    // Filter by priority if specified
    if (priority) query.priority = priority;

    // Build audience filter
    const audienceFilter = {
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'department', targetValue: req.user.department },
        { targetAudience: 'role', targetValue: req.user.role }
      ]
    };

    const finalQuery = { ...query, ...audienceFilter };

    const announcements = await Announcement.find(finalQuery)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('author', 'name email');

    const total = await Announcement.countDocuments(finalQuery);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get announcements for user error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      data: announcement
    });
  } catch (error: any) {
    console.error('Get announcement by ID error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, priority, targetAudience, targetValue, expiryDate, isActive, attachments } = req.body;

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is the author or has admin/hr role
    if (announcement.author.toString() !== req.user._id.toString() && 
        !['admin', 'hr'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        priority, 
        targetAudience, 
        targetValue, 
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive,
        attachments
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement
    });
  } catch (error: any) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is the author or has admin/hr role
    if (announcement.author.toString() !== req.user._id.toString() && 
        !['admin', 'hr'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    // Soft delete - mark as inactive
    announcement.isActive = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};