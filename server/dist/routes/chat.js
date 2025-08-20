"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Chat routes
router.get('/', chatController_1.getChats);
router.post('/', chatController_1.createChat);
router.get('/:id', chatController_1.getChatById);
router.post('/:id/participants', chatController_1.addParticipant);
router.delete('/:id/participants', chatController_1.removeParticipant);
// Message routes
router.get('/:chatId/messages', chatController_1.getMessages);
router.post('/:chatId/messages', chatController_1.sendMessage);
router.put('/:chatId/messages/read', chatController_1.markMessagesAsRead);
router.delete('/messages/:messageId', chatController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=chat.js.map