import React, { useState } from 'react';
import { Download, Filter, Search, Users, Building, UserCheck } from 'lucide-react';
import { useEmployee } from '../../contexts/EmployeeContext';
import jsPDF from 'jspdf';

interface EmployeeReportProps {
  dateRange: { from: string; to: string };
}

const EmployeeReport: React.FC<EmployeeReportProps> = ({ dateRange }) => {
  const { state: employeeState } = useEmployee();
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employeeState.employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    const matchesRole = !filterRole || employee.role === filterRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const departments = [...new Set(employeeState.employees.map(emp => emp.department))];
  const roles = [...new Set(employeeState.employees.map(emp => emp.role))];

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Employee Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.text(`Date Range: ${dateRange.from} to ${dateRange.to}`, 20, 50);
    
    // Summary
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 70);
    pdf.setFontSize(10);
    pdf.text(`Total Employees: ${filteredEmployees.length}`, 30, 80);
    pdf.text(`Active Employees: ${filteredEmployees.filter(e => e.status === 'active').length}`, 30, 90);
    pdf.text(`Departments: ${departments.length}`, 30, 100);
    
    // Employee List
    let yPos = 120;
    pdf.setFontSize(12);
    pdf.text('Employee Details', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(8);
    filteredEmployees.forEach((employee, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(`${index + 1}. ${employee.fullName}`, 20, yPos);
      pdf.text(`${employee.email}`, 80, yPos);
      pdf.text(`${employee.department}`, 140, yPos);
      pdf.text(`${employee.role}`, 180, yPos);
      yPos += 8;
    });
    
    pdf.save(`employee_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Designation', 'Role', 'Status', 'Date of Joining'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.fullName,
        emp.email,
        emp.phone,
        emp.department,
        emp.designation,
        emp.role,
        emp.status,
        emp.doj
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredEmployees.length,
    active: filteredEmployees.filter(e => e.status === 'active').length,
    departments: departments.length,
    avgTenure: filteredEmployees.length > 0 
      ? filteredEmployees.reduce((sum, emp) => {
          const joinDate = new Date(emp.doj);
          const today = new Date();
          const years = (today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return sum + years;
        }, 0) / filteredEmployees.length
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active Employees</p>
              <p className="text-2xl font-bold text-green-900">{stats.active}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Departments</p>
              <p className="text-2xl font-bold text-purple-900">{stats.departments}</p>
            </div>
            <Building className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Avg. Tenure</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.avgTenure.toFixed(1)}y</p>
            </div>
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
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

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Joining Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                    <div className="text-sm text-gray-500">{employee.designation}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-500">{employee.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(employee.doj).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeReport;