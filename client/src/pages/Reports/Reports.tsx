import React, { useState } from 'react';
import { Download, FileText, Calendar, Users, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import EmployeeReport from './EmployeeReport';
import AttendanceReport from './AttendanceReport';
import LeaveReport from './LeaveReport';
import PayrollReport from './PayrollReport';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employee' | 'attendance' | 'leave' | 'payroll'>('employee');
  const [dateRange, setDateRange] = useState({
    from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });

  const reportTypes = [
    {
      id: 'employee',
      title: 'Employee Reports',
      description: 'Employee list, details, and organizational data',
      icon: Users,
      color: 'blue',
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Daily, weekly, and monthly attendance tracking',
      icon: Calendar,
      color: 'green',
    },
    {
      id: 'leave',
      title: 'Leave Reports',
      description: 'Leave applications, balances, and history',
      icon: FileText,
      color: 'yellow',
    },
    {
      id: 'payroll',
      title: 'Payroll Reports',
      description: 'Salary, deductions, and payroll summaries',
      icon: Download,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and export comprehensive reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isActive = activeTab === report.id;
          
          return (
            <button
              key={report.id}
              onClick={() => setActiveTab(report.id as any)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                isActive
                  ? getColorClasses(report.color)
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-8 w-8 ${isActive ? '' : 'text-gray-400'}`} />
                {isActive && (
                  <div className="w-3 h-3 bg-current rounded-full"></div>
                )}
              </div>
              <h3 className={`font-semibold mb-2 ${isActive ? '' : 'text-gray-900'}`}>
                {report.title}
              </h3>
              <p className={`text-sm ${isActive ? 'opacity-80' : 'text-gray-600'}`}>
                {report.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {reportTypes.find(r => r.id === activeTab)?.title}
            </h2>
            <p className="text-gray-600">
              {reportTypes.find(r => r.id === activeTab)?.description}
            </p>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'employee' && <EmployeeReport dateRange={dateRange} />}
          {activeTab === 'attendance' && <AttendanceReport dateRange={dateRange} />}
          {activeTab === 'leave' && <LeaveReport dateRange={dateRange} />}
          {activeTab === 'payroll' && <PayrollReport dateRange={dateRange} />}
        </div>
      </div>
    </div>
  );
};

export default Reports;