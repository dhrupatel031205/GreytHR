import { Request, Response } from 'express';
import { Chat, Message } from '../models/Chat';
import Employee from '../models/Employee';

interface AuthRequest extends Request {
  user?: any;
}

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const chats = await Chat.find({
      participants: req.user._id
    })
    .sort({ 'lastMessage.timestamp': -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit))
    .populate('participants', 'name email avatar')
    .populate('groupAdmin', 'name email');

    const total = await Chat.countDocuments({
      participants: req.user._id
    });

    res.json({
      success: true,
      data: chats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { participantIds, isGroup, groupName } = req.body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ message: 'Participant IDs are required' });
    }

    // Add current user to participants if not already included
    const allParticipants = [...new Set([req.user._id, ...participantIds])];

    // For one-on-one chats, check if chat already exists
    if (!isGroup && allParticipants.length === 2) {
      const existingChat = await Chat.findOne({
        participants: { $all: allParticipants, $size: 2 },
        isGroup: false
      });

      if (existingChat) {
        return res.json({
          success: true,
          message: 'Chat already exists',
          data: existingChat
        });
      }
    }

    const chat = new Chat({
      participants: allParticipants,
      isGroup: isGroup || false,
      groupName: isGroup ? groupName : undefined,
      groupAdmin: isGroup ? req.user._id : undefined
    });

    await chat.save();

    // Populate participants before sending response
    await chat.populate('participants', 'name email avatar');
    if (isGroup) {
      await chat.populate('groupAdmin', 'name email');
    }

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });
  } catch (error: any) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email avatar')
      .populate('groupAdmin', 'name email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some((p: any) => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error: any) {
    console.error('Get chat by ID error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is a participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('sender', 'name email avatar');

    const total = await Message.countDocuments({ chatId });

    // Reverse the messages to show oldest first
    messages.reverse();

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content, messageType, fileUrl } = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ message: 'Message content or file URL is required' });
    }

    // Verify user is a participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      chatId,
      sender: req.user._id,
      content: content || '',
      messageType: messageType || 'text',
      fileUrl
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = {
      sender: req.user._id,
      content: content || (messageType === 'file' ? 'File' : 'Image'),
      timestamp: new Date()
    };
    await chat.save();

    // Populate sender before sending response
    await message.populate('sender', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;

    // Verify user is a participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark all messages in this chat as read for this user
    // Note: This is a simplified approach. In a real app, you might want to track
    // read status per user per message
    await Message.updateMany(
      { 
        chatId, 
        sender: { $ne: req.user._id },
        isRead: false 
      },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error: any) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their own message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Can only delete your own messages' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const addParticipant = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { participantId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Only group admin can add participants to group chats
    if (chat.isGroup && chat.groupAdmin?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group admin can add participants' });
    }

    if (!chat.isGroup) {
      return res.status(400).json({ message: 'Cannot add participants to one-on-one chat' });
    }

    if (chat.participants.includes(participantId)) {
      return res.status(400).json({ message: 'User is already a participant' });
    }

    chat.participants.push(participantId);
    await chat.save();

    await chat.populate('participants', 'name email avatar');

    res.json({
      success: true,
      message: 'Participant added successfully',
      data: chat
    });
  } catch (error: any) {
    console.error('Add participant error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const removeParticipant = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { participantId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Only group admin can remove participants from group chats
    if (chat.isGroup && chat.groupAdmin?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group admin can remove participants' });
    }

    if (!chat.isGroup) {
      return res.status(400).json({ message: 'Cannot remove participants from one-on-one chat' });
    }

    chat.participants = chat.participants.filter(p => p.toString() !== participantId);
    await chat.save();

    await chat.populate('participants', 'name email avatar');

    res.json({
      success: true,
      message: 'Participant removed successfully',
      data: chat
    });
  } catch (error: any) {
    console.error('Remove participant error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};