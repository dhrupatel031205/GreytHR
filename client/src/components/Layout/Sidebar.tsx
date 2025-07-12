import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Clock,
  Calendar,
  DollarSign,
  CheckSquare,
  Megaphone,
  FileText,
  MessageCircle,
  User,
  X,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { state } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'hr', 'employee'] },
    { icon: Users, label: 'Employees', path: '/employees', roles: ['admin', 'hr'] },
    { icon: Clock, label: 'Attendance', path: '/attendance', roles: ['admin', 'hr', 'employee'] },
    { icon: Calendar, label: 'Leaves', path: '/leaves', roles: ['admin', 'hr', 'employee'] },
    { icon: DollarSign, label: 'Payroll', path: '/payroll', roles: ['admin', 'hr', 'employee'] },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', roles: ['admin', 'hr', 'employee'] },
    { icon: Megaphone, label: 'Announcements', path: '/announcements', roles: ['admin', 'hr', 'employee'] },
    { icon: FileText, label: 'Reports', path: '/reports', roles: ['admin', 'hr'] },
    { icon: MessageCircle, label: 'Chat', path: '/chat', roles: ['admin', 'hr', 'employee'] },
    { icon: User, label: 'Profile', path: '/profile', roles: ['admin', 'hr', 'employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(state.user?.role || 'employee')
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">GreytHR</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-3 py-2 mb-2 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;