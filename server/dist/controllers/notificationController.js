"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.deleteAllNotifications = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10, isRead, type } = req.query;
        const query = { userId: req.user._id };
        if (isRead !== undefined)
            query.isRead = isRead === 'true';
        if (type)
            query.type = type;
        const notifications = await Notification_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Notification_1.default.countDocuments(query);
        const unreadCount = await Notification_1.default.countDocuments({
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
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification_1.default.findOne({
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
    }
    catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.default.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    }
    catch (error) {
        console.error('Mark all notifications as read error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification_1.default.findOne({
            _id: id,
            userId: req.user._id
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await Notification_1.default.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteNotification = deleteNotification;
const deleteAllNotifications = async (req, res) => {
    try {
        await Notification_1.default.deleteMany({ userId: req.user._id });
        res.json({
            success: true,
            message: 'All notifications deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete all notifications error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteAllNotifications = deleteAllNotifications;
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification_1.default.countDocuments({
            userId: req.user._id,
            isRead: false
        });
        res.json({
            success: true,
            data: { unreadCount }
        });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getUnreadCount = getUnreadCount;
//# sourceMappingURL=notificationController.js.map