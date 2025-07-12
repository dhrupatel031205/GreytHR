import React, { useRef, useEffect } from 'react';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { Message, ChatContact } from './Chat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  selectedContact: ChatContact;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  selectedContact,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = format(message.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          {/* Date Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
              {getDateLabel(dateKey)}
            </div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;
            const showAvatar = !isOwnMessage && (
              index === 0 || 
              dateMessages[index - 1]?.senderId !== message.senderId
            );

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                  isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  {showAvatar && !isOwnMessage && (
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {selectedContact.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {!showAvatar && !isOwnMessage && (
                    <div className="w-8 flex-shrink-0" />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}

                    {message.type === 'file' && (
                      <div className="flex items-center space-x-2">
                        {getFileIcon(message.fileName || '')}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{message.fileName}</p>
                          <p className="text-xs opacity-75">File</p>
                        </div>
                        <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {message.type === 'image' && message.fileUrl && (
                      <div>
                        <img
                          src={message.fileUrl}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg"
                        />
                        {message.content && (
                          <p className="text-sm mt-2">{message.content}</p>
                        )}
                      </div>
                    )}

                    <div className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                      {isOwnMessage && (
                        <span className="ml-1">
                          {message.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation with {selectedContact.name}</p>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;