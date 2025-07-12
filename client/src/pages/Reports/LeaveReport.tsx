import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';

interface LeaveReportProps {
  dateRange: { from: string; to: string };
}

const LeaveReport: React.FC<LeaveReportProps> = ({ dateRange }) => {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Mock leave data
  const leaveData = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      leaveType: 'Casual',
      fromDate: '2024-12-25',
      toDate: '2024-12-26',
      days: 2,
      status: 'approved',
      appliedDate: '2024-12-20',
      reason: 'Christmas holidays',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'Marketing',
      leaveType: 'Sick',
      fromDate: '2024-12-20',
      toDate: '2024-12-20',
      days: 1,
      status: 'approved',
      appliedDate: '2024-12-20',
      reason: 'Fever and cold',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Sales',
      leaveType: 'Earned',
      fromDate: '2024-12-30',
      toDate: '2025-01-02',
      days: 4,
      status: 'pending',
      appliedDate: '2024-12-22',
      reason: 'Year-end vacation',
    },
  ];

  const filteredLeaves = leaveData.filter(leave => {
    const matchesStatus = !filterStatus || leave.status === filterStatus;
    const matchesType = !filterType || leave.leaveType === filterType;
    return matchesStatus && matchesType;
  });

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Leave Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.text(`Period: ${dateRange.from} to ${dateRange.to}`, 20, 50);
    
    // Summary
    const totalLeaves = filteredLeaves.length;
    const approvedLeaves = filteredLeaves.filter(l => l.status === 'approved').length;
    const pendingLeaves = filteredLeaves.filter(l => l.status === 'pending').length;
    
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 70);
    pdf.setFontSize(10);
    pdf.text(`Total Leave Applications: ${totalLeaves}`, 30, 80);
    pdf.text(`Approved: ${approvedLeaves}`, 30, 90);
    pdf.text(`Pending: ${pendingLeaves}`, 30, 100);
    
    // Leave Details
    let yPos = 120;
    pdf.setFontSize(12);
    pdf.text('Leave Applications', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(8);
    pdf.text('Employee', 20, yPos);
    pdf.text('Type', 70, yPos);
    pdf.text('Days', 100, yPos);
    pdf.text('Status', 130, yPos);
    pdf.text('Applied', 160, yPos);
    yPos += 10;
    
    filteredLeaves.forEach((leave) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(leave.employeeName, 20, yPos);
      pdf.text(leave.leaveType, 70, yPos);
      pdf.text(leave.days.toString(), 100, yPos);
      pdf.text(leave.status, 130, yPos);
      pdf.text(new Date(leave.appliedDate).toLocaleDateString(), 160, yPos);
      yPos += 8;
    });
    
    pdf.save(`leave_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Leave Type', 'From Date', 'To Date', 'Days', 'Status', 'Applied Date', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...filteredLeaves.map(leave => [
        leave.employeeId,
        leave.employeeName,
        leave.department,
        leave.leaveType,
        leave.fromDate,
        leave.toDate,
        leave.days,
        leave.status,
        leave.appliedDate,
        `"${leave.reason}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredLeaves.length,
    approved: filteredLeaves.filter(l => l.status === 'approved').length,
    pending: filteredLeaves.filter(l => l.status === 'pending').length,
    rejected: filteredLeaves.filter(l => l.status === 'rejected').length,
    totalDays: filteredLeaves.reduce((sum, leave) => sum + leave.days, 0),
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Applications</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Days</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Casual">Casual</option>
            <option value="Sick">Sick</option>
            <option value="Earned">Earned</option>
            <option value="Maternity">Maternity</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={generateCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={generatePDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Leave Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Leave Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Applied Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                    <div className="text-sm text-gray-500">{leave.employeeId} • {leave.department}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{leave.leaveType} Leave</div>
                    <div className="text-sm text-gray-500">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {leave.days} day{leave.days > 1 ? 's' : ''}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(leave.status)}
                    <span className={getStatusBadge(leave.status)}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(leave.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                  {leave.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeaves.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leave records found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default LeaveReport;