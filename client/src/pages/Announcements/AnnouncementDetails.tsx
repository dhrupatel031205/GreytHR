import React from 'react';
import { X, Calendar, Users, Flag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Announcement } from './Announcements';

interface AnnouncementDetailsProps {
  announcement: Announcement;
  onClose: () => void;
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ announcement, onClose }) => {
  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
    switch (priority) {
      case 'urgent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'important':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'normal':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'important':
        return '⚠️';
      default:
        return '📢';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Announcement Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getPriorityIcon(announcement.priority)}</span>
                <h1 className="text-2xl font-bold text-gray-900">{announcement.title}</h1>
                <span className={getPriorityBadge(announcement.priority)}>
                  <Flag className="h-4 w-4 inline mr-1" />
                  {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {announcement.message}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Posted by</p>
                    <p className="text-gray-900">{announcement.author}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-gray-900">
                      {format(new Date(announcement.createdAt), 'EEEE, MMMM dd, yyyy \'at\' HH:mm')}
                    </p>
                  </div>
                </div>

                {announcement.expiresAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Expires</p>
                      <p className="text-yellow-600">
                        {format(new Date(announcement.expiresAt), 'EEEE, MMMM dd, yyyy \'at\' HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Target Audience</p>
                    <p className="text-gray-900">
                      {announcement.audience === 'all' 
                        ? 'All Employees'
                        : announcement.audience === 'department'
                        ? `${announcement.targetDepartment} Department`
                        : `${announcement.targetRole} Role`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Flag className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Priority Level</p>
                    <span className={getPriorityBadge(announcement.priority)}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    This announcement is currently active
                  </p>
                  <p className="text-sm text-green-700">
                    {announcement.expiresAt 
                      ? `Will expire on ${format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}`
                      : 'No expiration date set'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;