import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface LeaveRecord {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'approved' | 'rejected' | 'pending';
  appliedDate: string;
  approvedBy?: string;
  comments?: string;
}

const LeaveHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);

  const leaveRecords: LeaveRecord[] = [
    {
      id: '1',
      type: 'Casual',
      fromDate: '2024-12-25',
      toDate: '2024-12-26',
      days: 2,
      reason: 'Christmas holidays with family',
      status: 'approved',
      appliedDate: '2024-12-20',
      approvedBy: 'HR Manager',
      comments: 'Approved. Enjoy your holidays!',
    },
    {
      id: '2',
      type: 'Sick',
      fromDate: '2024-12-20',
      toDate: '2024-12-20',
      days: 1,
      reason: 'Fever and cold symptoms',
      status: 'approved',
      appliedDate: '2024-12-20',
      approvedBy: 'HR Manager',
    },
    {
      id: '3',
      type: 'Earned',
      fromDate: '2024-12-15',
      toDate: '2024-12-17',
      days: 3,
      reason: 'Family vacation to Goa',
      status: 'pending',
      appliedDate: '2024-12-10',
    },
    {
      id: '4',
      type: 'Casual',
      fromDate: '2024-11-28',
      toDate: '2024-11-29',
      days: 2,
      reason: 'Wedding ceremony to attend',
      status: 'approved',
      appliedDate: '2024-11-25',
      approvedBy: 'Team Lead',
    },
    {
      id: '5',
      type: 'Emergency',
      fromDate: '2024-11-15',
      toDate: '2024-11-15',
      days: 1,
      reason: 'Medical emergency in family',
      status: 'rejected',
      appliedDate: '2024-11-14',
      approvedBy: 'HR Manager',
      comments: 'Medical certificate required for emergency leave.',
    },
  ];

  const filteredRecords = leaveRecords.filter(record => {
    const matchesSearch = record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesType = !filterType || record.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const leaveTypes = [...new Set(leaveRecords.map(record => record.type))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leave records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {leaveTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Leave Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.type} Leave
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {record.reason}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.fromDate), 'MMM dd')} - {format(new Date(record.toDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.days} day{record.days > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(record.status)}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.appliedDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLeave(record)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedLeave(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Leave Details</h2>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <p className="text-sm text-gray-900">{selectedLeave.type} Leave</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">From Date</label>
                    <p className="text-sm text-gray-900">{format(new Date(selectedLeave.fromDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">To Date</label>
                    <p className="text-sm text-gray-900">{format(new Date(selectedLeave.toDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{selectedLeave.days} day{selectedLeave.days > 1 ? 's' : ''}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedLeave.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={getStatusBadge(selectedLeave.status)}>
                    {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="text-sm text-gray-900">{format(new Date(selectedLeave.appliedDate), 'MMM dd, yyyy')}</p>
                </div>

                {selectedLeave.approvedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approved By</label>
                    <p className="text-sm text-gray-900">{selectedLeave.approvedBy}</p>
                  </div>
                )}

                {selectedLeave.comments && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <p className="text-sm text-gray-900">{selectedLeave.comments}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;