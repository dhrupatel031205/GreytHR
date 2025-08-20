import { Request, Response } from 'express';
import Notification from '../models/Notification';

interface AuthRequest extends Request {
  user?: any;
}

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, isRead, type } = req.query;

    const query: any = { userId: req.user._id };
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      success: true,
      data: notifications,
      meta: {
        unreadCount
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};