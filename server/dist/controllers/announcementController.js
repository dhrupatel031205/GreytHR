"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAnnouncementsForUser = exports.getAllAnnouncements = exports.createAnnouncement = void 0;
const Announcement_1 = __importDefault(require("../models/Announcement"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, targetAudience, targetValue, expiryDate, attachments } = req.body;
        const announcement = new Announcement_1.default({
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
            targetUsers = await User_1.default.find({ isActive: true });
        }
        else if (targetAudience === 'department' && targetValue) {
            targetUsers = await User_1.default.find({ department: targetValue, isActive: true });
        }
        else if (targetAudience === 'role' && targetValue) {
            targetUsers = await User_1.default.find({ role: targetValue, isActive: true });
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
            await Notification_1.default.insertMany(notifications);
        }
        // Populate author before sending response
        await announcement.populate('author', 'name email');
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    }
    catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.createAnnouncement = createAnnouncement;
const getAllAnnouncements = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, targetAudience, search, includeExpired = false } = req.query;
        const query = { isActive: true };
        if (priority)
            query.priority = priority;
        if (targetAudience)
            query.targetAudience = targetAudience;
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
        const announcements = await Announcement_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('author', 'name email');
        const total = await Announcement_1.default.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get all announcements error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAllAnnouncements = getAllAnnouncements;
const getAnnouncementsForUser = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority } = req.query;
        const query = {
            isActive: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } }
            ]
        };
        // Filter by priority if specified
        if (priority)
            query.priority = priority;
        // Build audience filter
        const audienceFilter = {
            $or: [
                { targetAudience: 'all' },
                { targetAudience: 'department', targetValue: req.user.department },
                { targetAudience: 'role', targetValue: req.user.role }
            ]
        };
        const finalQuery = { ...query, ...audienceFilter };
        const announcements = await Announcement_1.default.find(finalQuery)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .populate('author', 'name email');
        const total = await Announcement_1.default.countDocuments(finalQuery);
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
    }
    catch (error) {
        console.error('Get announcements for user error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAnnouncementsForUser = getAnnouncementsForUser;
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement_1.default.findById(req.params.id)
            .populate('author', 'name email');
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json({
            success: true,
            data: announcement
        });
    }
    catch (error) {
        console.error('Get announcement by ID error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getAnnouncementById = getAnnouncementById;
const updateAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, targetAudience, targetValue, expiryDate, isActive, attachments } = req.body;
        const announcement = await Announcement_1.default.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        // Check if user is the author or has admin/hr role
        if (announcement.author.toString() !== req.user._id.toString() &&
            !['admin', 'hr'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to update this announcement' });
        }
        const updatedAnnouncement = await Announcement_1.default.findByIdAndUpdate(req.params.id, {
            title,
            content,
            priority,
            targetAudience,
            targetValue,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            isActive,
            attachments
        }, { new: true, runValidators: true }).populate('author', 'name email');
        res.json({
            success: true,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement
        });
    }
    catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
//# sourceMappingURL=announcementController.js.map