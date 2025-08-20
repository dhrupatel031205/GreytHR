import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserSwitcher: React.FC = () => {
  const { state, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSwitch = (user: any) => {
    switchUser(user);
    setIsOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'hr':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'hr':
        return '👥';
      case 'employee':
        return '👤';
      default:
        return '👤';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Users className="h-5 w-5" />
        <span className="font-medium">Switch User</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Switch User Role</h3>
            <p className="text-sm text-gray-600 mt-1">
              Currently logged in as: <span className="font-medium">{state.user?.name}</span>
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {state.availableUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSwitch(user)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                  state.user?._id === user._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getRoleIcon(user.role)}</div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.department}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                    {state.user?._id === user._id && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Role Permissions:</p>
              <ul className="space-y-1">
                <li>👑 <strong>Admin:</strong> Full access to all features</li>
                <li>👥 <strong>HR:</strong> Employee management, payroll, reports</li>
                <li>👤 <strong>Employee:</strong> Personal data, attendance, leave</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;