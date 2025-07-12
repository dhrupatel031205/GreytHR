import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface PendingLeave {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  appliedDate: string;
}

const LeaveApproval: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<PendingLeave | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');

  const pendingLeaves: PendingLeave[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      type: 'Earned',
      fromDate: '2024-12-15',
      toDate: '2024-12-17',
      days: 3,
      reason: 'Family vacation to Goa',
      appliedDate: '2024-12-10',
    },
    {
      id: '2',
      employeeName: 'Sarah Wilson',
      employeeId: 'EMP004',
      department: 'Marketing',
      type: 'Casual',
      fromDate: '2024-12-30',
      toDate: '2024-12-31',
      days: 2,
      reason: 'New Year celebration with family',
      appliedDate: '2024-12-20',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Sales',
      type: 'Sick',
      fromDate: '2024-12-28',
      toDate: '2024-12-29',
      days: 2,
      reason: 'Medical appointment and recovery',
      appliedDate: '2024-12-25',
    },
  ];

  const handleApprovalAction = (leave: PendingLeave, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (approvalAction === 'approve') {
      toast.success(`Leave request approved for ${selectedLeave?.employeeName}`);
    } else {
      toast.success(`Leave request rejected for ${selectedLeave?.employeeName}`);
    }
    setShowApprovalModal(false);
    setSelectedLeave(null);
    setComments('');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingLeaves.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Approved Today</p>
              <p className="text-2xl font-bold text-green-900">5</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Rejected Today</p>
              <p className="text-2xl font-bold text-red-900">1</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
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
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {leave.employeeName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {leave.employeeId} • {leave.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {leave.type} Leave
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {leave.reason}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(leave.fromDate), 'MMM dd')} - {format(new Date(leave.toDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.days} day{leave.days > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(leave.appliedDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleApprovalAction(leave, 'approve')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleApprovalAction(leave, 'reject')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && !showApprovalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedLeave(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Leave Request Details</h2>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee</label>
                  <p className="text-sm text-gray-900">{selectedLeave.employeeName} ({selectedLeave.employeeId})</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedLeave.department}</p>
                </div>

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
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="text-sm text-gray-900">{format(new Date(selectedLeave.appliedDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => handleApprovalAction(selectedLeave, 'reject')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprovalAction(selectedLeave, 'approve')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedLeave && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowApprovalModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
                </h2>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to {approvalAction} the leave request for {selectedLeave.employeeName}?
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    placeholder="Add comments for the employee..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApproval}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    approvalAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;