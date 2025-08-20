import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Chat, Message } from '../models/Chat';
import User from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export const setupSocketIO = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid token or user inactive'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user.name} connected with socket ID: ${socket.id}`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Handle joining chat rooms
    socket.on('join_chat', async (chatId: string) => {
      try {
        // Verify user is a participant in the chat
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.includes(socket.userId!)) {
          socket.join(`chat_${chatId}`);
          console.log(`User ${socket.user.name} joined chat ${chatId}`);
        }
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    });

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId: string) => {
      socket.leave(`chat_${chatId}`);
      console.log(`User ${socket.user.name} left chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data: {
      chatId: string;
      content: string;
      messageType?: string;
      fileUrl?: string;
    }) => {
      try {
        const { chatId, content, messageType = 'text', fileUrl } = data;

        // Verify user is a participant in the chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId!)) {
          socket.emit('error', { message: 'Access denied to this chat' });
          return;
        }

        // Create and save the message
        const message = new Message({
          chatId,
          sender: socket.userId,
          content: content || '',
          messageType,
          fileUrl
        });

        await message.save();

        // Update chat's last message
        chat.lastMessage = {
          sender: socket.userId!,
          content: content || (messageType === 'file' ? 'File' : 'Image'),
          timestamp: new Date()
        };
        await chat.save();

        // Populate sender information
        await message.populate('sender', 'name email avatar');

        // Emit message to all participants in the chat
        io.to(`chat_${chatId}`).emit('new_message', {
          message,
          chat: {
            _id: chat._id,
            lastMessage: chat.lastMessage
          }
        });

        console.log(`Message sent in chat ${chatId} by ${socket.user.name}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        chatId
      });
    });

    socket.on('typing_stop', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_stop_typing', {
        userId: socket.userId,
        chatId
      });
    });

    // Handle marking messages as read
    socket.on('mark_messages_read', async (chatId: string) => {
      try {
        // Verify user is a participant in the chat
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.includes(socket.userId!)) {
          await Message.updateMany(
            { 
              chatId, 
              sender: { $ne: socket.userId },
              isRead: false 
            },
            { isRead: true }
          );

          // Notify other participants that messages were read
          socket.to(`chat_${chatId}`).emit('messages_read', {
            userId: socket.userId,
            chatId
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle user status updates
    socket.on('update_status', (status: 'online' | 'away' | 'busy') => {
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        status
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
      
      // Notify other users that this user went offline
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });

  return io;
};

// Helper function to send notification to specific user
export const sendNotificationToUser = (io: Server, userId: string, notification: any) => {
  io.to(`user_${userId}`).emit('new_notification', notification);
};

// Helper function to broadcast announcement to all users
export const broadcastAnnouncement = (io: Server, announcement: any) => {
  io.emit('new_announcement', announcement);
};