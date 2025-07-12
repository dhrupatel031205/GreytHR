import React, { useState } from 'react';
import { Download, DollarSign, TrendingUp, Users, Calculator } from 'lucide-react';
import jsPDF from 'jspdf';

interface PayrollReportProps {
  dateRange: { from: string; to: string };
}

const PayrollReport: React.FC<PayrollReportProps> = ({ dateRange }) => {
  const [filterDepartment, setFilterDepartment] = useState('');

  // Mock payroll data
  const payrollData = [
    {
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      designation: 'Senior Developer',
      basicSalary: 3000,
      allowances: 1700,
      grossSalary: 4700,
      deductions: 450,
      netSalary: 4250,
      tax: 300,
      pf: 360,
      esi: 75,
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'Marketing',
      designation: 'Marketing Manager',
      basicSalary: 2800,
      allowances: 1600,
      grossSalary: 4400,
      deductions: 400,
      netSalary: 4000,
      tax: 250,
      pf: 336,
      esi: 70,
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Sales',
      designation: 'Sales Executive',
      basicSalary: 3500,
      allowances: 1950,
      grossSalary: 5450,
      deductions: 550,
      netSalary: 4900,
      tax: 400,
      pf: 420,
      esi: 87,
    },
  ];

  const filteredPayroll = payrollData.filter(payroll => {
    const matchesDepartment = !filterDepartment || payroll.department === filterDepartment;
    return matchesDepartment;
  });

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Payroll Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.text(`Period: ${dateRange.from} to ${dateRange.to}`, 20, 50);
    
    // Summary
    const totalGross = filteredPayroll.reduce((sum, emp) => sum + emp.grossSalary, 0);
    const totalNet = filteredPayroll.reduce((sum, emp) => sum + emp.netSalary, 0);
    const totalDeductions = filteredPayroll.reduce((sum, emp) => sum + emp.deductions, 0);
    
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 70);
    pdf.setFontSize(10);
    pdf.text(`Total Employees: ${filteredPayroll.length}`, 30, 80);
    pdf.text(`Total Gross Salary: $${totalGross.toLocaleString()}`, 30, 90);
    pdf.text(`Total Net Salary: $${totalNet.toLocaleString()}`, 30, 100);
    pdf.text(`Total Deductions: $${totalDeductions.toLocaleString()}`, 30, 110);
    
    // Employee Details
    let yPos = 130;
    pdf.setFontSize(12);
    pdf.text('Employee Payroll Details', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(8);
    pdf.text('Name', 20, yPos);
    pdf.text('Department', 70, yPos);
    pdf.text('Gross', 120, yPos);
    pdf.text('Deductions', 150, yPos);
    pdf.text('Net', 180, yPos);
    yPos += 10;
    
    filteredPayroll.forEach((employee) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(employee.employeeName, 20, yPos);
      pdf.text(employee.department, 70, yPos);
      pdf.text(`$${employee.grossSalary}`, 120, yPos);
      pdf.text(`$${employee.deductions}`, 150, yPos);
      pdf.text(`$${employee.netSalary}`, 180, yPos);
      yPos += 8;
    });
    
    pdf.save(`payroll_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Basic Salary', 'Allowances', 'Gross Salary', 'Deductions', 'Net Salary', 'Tax', 'PF', 'ESI'];
    const csvContent = [
      headers.join(','),
      ...filteredPayroll.map(emp => [
        emp.employeeId,
        emp.employeeName,
        emp.department,
        emp.designation,
        emp.basicSalary,
        emp.allowances,
        emp.grossSalary,
        emp.deductions,
        emp.netSalary,
        emp.tax,
        emp.pf,
        emp.esi
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = [...new Set(payrollData.map(emp => emp.department))];

  const stats = {
    totalEmployees: filteredPayroll.length,
    totalGross: filteredPayroll.reduce((sum, emp) => sum + emp.grossSalary, 0),
    totalNet: filteredPayroll.reduce((sum, emp) => sum + emp.netSalary, 0),
    totalDeductions: filteredPayroll.reduce((sum, emp) => sum + emp.deductions, 0),
    avgSalary: filteredPayroll.length > 0 
      ? filteredPayroll.reduce((sum, emp) => sum + emp.netSalary, 0) / filteredPayroll.length 
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Total Gross</p>
              <p className="text-2xl font-bold text-green-900">${stats.totalGross.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Net</p>
              <p className="text-2xl font-bold text-purple-900">${stats.totalNet.toLocaleString()}</p>
            </div>
            <Calculator className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Total Deductions</p>
              <p className="text-2xl font-bold text-red-900">${stats.totalDeductions.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Avg Salary</p>
              <p className="text-2xl font-bold text-yellow-900">${Math.round(stats.avgSalary).toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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

      {/* Payroll Table */}
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
                Basic Salary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Allowances
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Gross Salary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Deductions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Net Salary
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayroll.map((employee) => (
              <tr key={employee.employeeId} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                    <div className="text-sm text-gray-500">{employee.employeeId} • {employee.designation}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  ${employee.basicSalary.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ${employee.allowances.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-700">
                  ${employee.grossSalary.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-red-700">
                    ${employee.deductions.toLocaleString()}
                    <div className="text-xs text-gray-500">
                      Tax: ${employee.tax} | PF: ${employee.pf} | ESI: ${employee.esi}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-blue-700">
                  ${employee.netSalary.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayroll.length === 0 && (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll records found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default PayrollReport;