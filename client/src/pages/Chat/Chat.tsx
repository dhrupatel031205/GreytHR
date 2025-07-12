import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployee } from '../../contexts/EmployeeContext';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import { format } from 'date-fns';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileUrl?: string;
  seen: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online: boolean;
  department: string;
  role: string;
}

const Chat: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: employeeState } = useEmployee();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'EMP002',
      receiverId: authState.user?.id || '',
      content: 'Hi! How are you doing today?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      seen: false,
    },
    {
      id: '2',
      senderId: authState.user?.id || '',
      receiverId: 'EMP002',
      content: 'I\'m doing great! Just working on the new project. How about you?',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      seen: true,
    },
    {
      id: '3',
      senderId: 'EMP002',
      receiverId: authState.user?.id || '',
      content: 'Same here! The deadline is approaching fast. Let me know if you need any help.',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      seen: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert employees to chat contacts
  const contacts: ChatContact[] = employeeState.employees
    .filter(emp => emp.id !== authState.user?.id)
    .map(emp => {
      const userMessages = messages.filter(
        msg => msg.senderId === emp.id || msg.receiverId === emp.id
      );
      const lastMessage = userMessages[userMessages.length - 1];
      const unreadCount = userMessages.filter(
        msg => msg.senderId === emp.id && !msg.seen
      ).length;

      return {
        id: emp.id,
        name: emp.fullName,
        avatar: emp.avatar,
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.timestamp,
        unreadCount,
        online: Math.random() > 0.5, // Mock online status
        department: emp.department,
        role: emp.role,
      };
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: authState.user?.id || '',
      receiverId: selectedContact.id,
      content: message.trim(),
      timestamp: new Date(),
      type: 'text',
      seen: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        receiverId: authState.user?.id || '',
        content: 'Thanks for the message! I\'ll get back to you soon.',
        timestamp: new Date(),
        type: 'text',
        seen: false,
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: authState.user?.id || '',
      receiverId: selectedContact.id,
      content: `Shared a file: ${file.name}`,
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      seen: false,
    };

    setMessages([...messages, newMessage]);
  };

  const getContactMessages = (contactId: string) => {
    return messages.filter(
      msg => 
        (msg.senderId === contactId && msg.receiverId === authState.user?.id) ||
        (msg.senderId === authState.user?.id && msg.receiverId === contactId)
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-100 flex">
      {/* Sidebar */}
      <ChatSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedContact.name.charAt(0)}
                      </span>
                    </div>
                    {selectedContact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedContact.online ? 'Online' : 'Offline'} • {selectedContact.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <MessageList
              messages={getContactMessages(selectedContact.id)}
              currentUserId={authState.user?.id || ''}
              selectedContact={selectedContact}
            />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a contact from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;