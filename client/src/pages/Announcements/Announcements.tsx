import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Megaphone, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetails from './AnnouncementDetails';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  audience: 'all' | 'department' | 'role';
  targetDepartment?: string;
  targetRole?: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

const Announcements: React.FC = () => {
  const { state } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Holiday Schedule Update',
      message: 'Please note the updated holiday schedule for the upcoming festive season. The office will be closed from December 24th to January 2nd.',
      author: 'HR Manager',
      audience: 'all',
      priority: 'important',
      createdAt: '2024-12-20T10:00:00Z',
      expiresAt: '2025-01-03T00:00:00Z',
      isActive: true,
    },
    {
      id: '2',
      title: 'New Security Protocols',
      message: 'We are implementing new security protocols effective immediately. All employees must use two-factor authentication for system access.',
      author: 'Admin User',
      audience: 'all',
      priority: 'urgent',
      createdAt: '2024-12-19T14:30:00Z',
      isActive: true,
    },
    {
      id: '3',
      title: 'Engineering Team Meeting',
      message: 'Monthly engineering team meeting scheduled for December 30th at 2 PM in Conference Room A. Please prepare your project updates.',
      author: 'HR Manager',
      audience: 'department',
      targetDepartment: 'Engineering',
      priority: 'normal',
      createdAt: '2024-12-18T09:15:00Z',
      expiresAt: '2024-12-30T18:00:00Z',
      isActive: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || announcement.priority === filterPriority;
    
    return matchesSearch && matchesPriority && announcement.isActive;
  });

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.map(a => 
        a.id === id ? { ...a, isActive: false } : a
      ));
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements & Notices</h1>
          <p className="text-gray-600">Broadcast important messages and updates</p>
        </div>
        {(state.user?.role === 'admin' || state.user?.role === 'hr') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.filter(a => a.isActive).length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Urgent Notices</p>
              <p className="text-2xl font-bold text-red-600">
                {announcements.filter(a => a.priority === 'urgent' && a.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Company Wide</p>
              <p className="text-2xl font-bold text-green-600">
                {announcements.filter(a => a.audience === 'all' && a.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredAnnouncements.length} announcements found
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-lg p-6 shadow-sm border-l-4 hover:shadow-md transition-shadow duration-200 ${
              announcement.priority === 'urgent'
                ? 'border-l-red-500'
                : announcement.priority === 'important'
                ? 'border-l-yellow-500'
                : 'border-l-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getPriorityIcon(announcement.priority)}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className={getPriorityBadge(announcement.priority)}>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{announcement.message}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {announcement.audience === 'all' 
                        ? 'All Employees'
                        : announcement.audience === 'department'
                        ? `${announcement.targetDepartment} Department`
                        : `${announcement.targetRole} Role`
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(announcement.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <span>By {announcement.author}</span>
                  {announcement.expiresAt && (
                    <span className="text-yellow-600">
                      Expires: {format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {(state.user?.role === 'admin' || state.user?.role === 'hr') && (
                  <>
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-600">
            {searchTerm || filterPriority 
              ? 'Try adjusting your search criteria'
              : 'No announcements have been posted yet'
            }
          </p>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showForm && (
        <AnnouncementForm
          announcement={editingAnnouncement}
          onClose={handleFormClose}
          onSave={(announcement) => {
            if (editingAnnouncement) {
              setAnnouncements(announcements.map(a => 
                a.id === editingAnnouncement.id ? announcement : a
              ));
            } else {
              setAnnouncements([announcement, ...announcements]);
            }
            handleFormClose();
          }}
        />
      )}

      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetails
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
};

export default Announcements;