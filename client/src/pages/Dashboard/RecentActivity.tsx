import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'leave_approved',
      message: 'John Doe\'s leave request has been approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 2,
      type: 'new_employee',
      message: 'Sarah Wilson has been added to the system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 3,
      type: 'payroll_generated',
      message: 'Payroll for December has been generated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      type: 'leave_rejected',
      message: 'Mike Johnson\'s leave request has been rejected',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${activity.bgColor}`}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(activity.timestamp, 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;