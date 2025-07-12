import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LeaveApplication from './LeaveApplication';
import LeaveHistory from './LeaveHistory';
import LeaveApproval from './LeaveApproval';

const LeaveManagement: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'history' | 'approval'>('overview');
  const [showApplication, setShowApplication] = useState(false);

  const leaveBalance = {
    casual: { total: 12, used: 5, remaining: 7 },
    sick: { total: 10, used: 2, remaining: 8 },
    earned: { total: 15, used: 8, remaining: 7 },
    maternity: { total: 180, used: 0, remaining: 180 },
  };

  const recentLeaves = [
    { id: 1, type: 'Casual', dates: 'Dec 25-26, 2024', status: 'approved', reason: 'Christmas holidays' },
    { id: 2, type: 'Sick', dates: 'Dec 20, 2024', status: 'approved', reason: 'Fever and cold' },
    { id: 3, type: 'Earned', dates: 'Dec 15-17, 2024', status: 'pending', reason: 'Family vacation' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage leave applications and track balances</p>
        </div>
        <button
          onClick={() => setShowApplication(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave History
            </button>
            {(state.user?.role === 'admin' || state.user?.role === 'hr') && (
              <button
                onClick={() => setActiveTab('approval')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approval'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Approvals
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Leave Balance Cards */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(leaveBalance).map(([type, balance]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">{type} Leave</h4>
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total</span>
                          <span className="font-medium">{balance.total} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Used</span>
                          <span className="font-medium">{balance.used} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining</span>
                          <span className="font-medium text-green-600">{balance.remaining} days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(balance.used / balance.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Leave Applications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Leave Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reason
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentLeaves.map((leave) => (
                          <tr key={leave.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {leave.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {leave.dates}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {leave.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(leave.status)}
                                <span className={getStatusBadge(leave.status)}>
                                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && <LeaveHistory />}
          {activeTab === 'approval' && <LeaveApproval />}
        </div>
      </div>

      {/* Leave Application Modal */}
      {showApplication && (
        <LeaveApplication onClose={() => setShowApplication(false)} />
      )}
    </div>
  );
};

export default LeaveManagement;