import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ChatContact } from './Chat';

interface ChatSidebarProps {
  contacts: ChatContact[];
  selectedContact: ChatContact | null;
  onSelectContact: (contact: ChatContact) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (date?: Date) => {
    if (!date) return '';
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No contacts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  selectedContact?.id === contact.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {contact.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium truncate ${
                        contact.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {contact.name}
                      </h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-500 ml-2">
                          {formatMessageTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        contact.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {contact.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {contact.department} • {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;