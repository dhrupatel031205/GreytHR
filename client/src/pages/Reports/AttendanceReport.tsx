import React, { useState } from 'react';
import { Download, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import jsPDF from 'jspdf';

interface AttendanceReportProps {
  dateRange: { from: string; to: string };
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ dateRange }) => {
  const [viewType, setViewType] = useState<'summary' | 'detailed'>('summary');

  // Mock attendance data
  const attendanceData = [
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      lateDays: 3,
      avgHours: 8.5,
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'Marketing',
      totalDays: 22,
      presentDays: 21,
      absentDays: 1,
      lateDays: 1,
      avgHours: 8.2,
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Sales',
      totalDays: 22,
      presentDays: 19,
      absentDays: 3,
      lateDays: 2,
      avgHours: 8.0,
    },
  ];

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Attendance Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.text(`Period: ${dateRange.from} to ${dateRange.to}`, 20, 50);
    
    // Summary
    const totalEmployees = attendanceData.length;
    const avgAttendance = attendanceData.reduce((sum, emp) => sum + (emp.presentDays / emp.totalDays), 0) / totalEmployees * 100;
    
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 70);
    pdf.setFontSize(10);
    pdf.text(`Total Employees: ${totalEmployees}`, 30, 80);
    pdf.text(`Average Attendance: ${avgAttendance.toFixed(1)}%`, 30, 90);
    
    // Employee Details
    let yPos = 110;
    pdf.setFontSize(12);
    pdf.text('Employee Attendance Details', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(8);
    pdf.text('Name', 20, yPos);
    pdf.text('Department', 70, yPos);
    pdf.text('Present', 120, yPos);
    pdf.text('Absent', 150, yPos);
    pdf.text('Late', 180, yPos);
    yPos += 10;
    
    attendanceData.forEach((employee) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(employee.employeeName, 20, yPos);
      pdf.text(employee.department, 70, yPos);
      pdf.text(employee.presentDays.toString(), 120, yPos);
      pdf.text(employee.absentDays.toString(), 150, yPos);
      pdf.text(employee.lateDays.toString(), 180, yPos);
      yPos += 8;
    });
    
    pdf.save(`attendance_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Total Days', 'Present Days', 'Absent Days', 'Late Days', 'Attendance %', 'Avg Hours'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(emp => [
        emp.employeeId,
        emp.employeeName,
        emp.department,
        emp.totalDays,
        emp.presentDays,
        emp.absentDays,
        emp.lateDays,
        ((emp.presentDays / emp.totalDays) * 100).toFixed(1),
        emp.avgHours
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalEmployees = attendanceData.length;
  const avgAttendance = attendanceData.reduce((sum, emp) => sum + (emp.presentDays / emp.totalDays), 0) / totalEmployees * 100;
  const totalPresent = attendanceData.reduce((sum, emp) => sum + emp.presentDays, 0);
  const totalAbsent = attendanceData.reduce((sum, emp) => sum + emp.absentDays, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900">{totalEmployees}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-900">{avgAttendance.toFixed(1)}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Total Present</p>
              <p className="text-2xl font-bold text-yellow-900">{totalPresent}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Total Absent</p>
              <p className="text-2xl font-bold text-red-900">{totalAbsent}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'summary' | 'detailed')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="summary">Summary View</option>
            <option value="detailed">Detailed View</option>
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

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Present Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Absent Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Late Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Attendance %
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Avg Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((employee) => {
              const attendancePercentage = (employee.presentDays / employee.totalDays) * 100;
              
              return (
                <tr key={employee.employeeId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-700">{employee.presentDays}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-700">{employee.absentDays}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-yellow-700">{employee.lateDays}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            attendancePercentage >= 90 ? 'bg-green-500' :
                            attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        attendancePercentage >= 90 ? 'text-green-700' :
                        attendancePercentage >= 75 ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{employee.avgHours}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;