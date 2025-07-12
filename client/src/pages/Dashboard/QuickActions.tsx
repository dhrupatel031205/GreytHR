import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Clock, Calendar, FileText, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const QuickActions: React.FC = () => {
  const { state } = useAuth();

  const actions = [
    {
      title: 'Add Employee',
      description: 'Add a new employee to the system',
      icon: UserPlus,
      link: '/employees',
      color: 'blue',
      roles: ['admin', 'hr'],
    },
    {
      title: 'Mark Attendance',
      description: 'Record your attendance for today',
      icon: Clock,
      link: '/attendance',
      color: 'green',
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Apply Leave',
      description: 'Submit a new leave request',
      icon: Calendar,
      link: '/leaves',
      color: 'yellow',
      roles: ['admin', 'hr', 'employee'],
    },
    {
      title: 'Generate Report',
      description: 'Create and download reports',
      icon: FileText,
      link: '/reports',
      color: 'purple',
      roles: ['admin', 'hr'],
    },
  ];

  const filteredActions = actions.filter(action => 
    action.roles.includes(state.user?.role || 'employee')
  );

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    green: 'text-green-600 bg-green-50 hover:bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100',
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.link}
              className={`block p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 ${colorClasses[action.color]}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;