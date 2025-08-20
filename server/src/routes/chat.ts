import express from 'express';
import {
  getChats,
  createChat,
  getChatById,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
  addParticipant,
  removeParticipant
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Chat routes
router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.post('/:id/participants', addParticipant);
router.delete('/:id/participants', removeParticipant);

// Message routes
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);
router.put('/:chatId/messages/read', markMessagesAsRead);
router.delete('/messages/:messageId', deleteMessage);

export default router;