import React, { useState } from 'react';
import { Download, Eye, DollarSign, Calculator, FileText, Users } from 'lucide-react';
import PayrollDetails from './PayrollDetails';
import SalaryStructure from './SalaryStructure';
import PayslipGenerator from './PayslipGenerator';

const PayrollSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payslips' | 'structure'>('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const payrollSummary = {
    totalEmployees: 100,
    totalPayroll: 245000,
    processed: 95,
    pending: 5,
  };

  const recentPayslips = [
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      month: 'December 2024',
      grossSalary: 5000,
      netSalary: 4250,
      status: 'processed',
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      month: 'December 2024',
      grossSalary: 4500,
      netSalary: 3825,
      status: 'processed',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      month: 'December 2024',
      grossSalary: 5500,
      netSalary: 4675,
      status: 'pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'processed':
        return `${baseClasses} bg-green-100 text-green-800`;
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
          <h1 className="text-2xl font-bold text-gray-900">Payroll System</h1>
          <p className="text-gray-600">Manage salaries, payslips, and compensation</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Process Payroll</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{payrollSummary.totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">${payrollSummary.totalPayroll.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Processed</p>
              <p className="text-2xl font-bold text-green-600">{payrollSummary.processed}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{payrollSummary.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
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
              Payroll Overview
            </button>
            <button
              onClick={() => setActiveTab('payslips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payslips'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payslips
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'structure'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Salary Structure
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Payslips */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payslips</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gross Salary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Salary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPayslips.map((payslip) => (
                          <tr key={payslip.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {payslip.employeeName.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {payslip.employeeName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {payslip.employeeId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payslip.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${payslip.grossSalary.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${payslip.netSalary.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(payslip.status)}>
                                {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedEmployee(payslip.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <Download className="h-4 w-4" />
                                </button>
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

          {activeTab === 'payslips' && <PayslipGenerator />}
          {activeTab === 'structure' && <SalaryStructure />}
        </div>
      </div>

      {/* Payroll Details Modal */}
      {selectedEmployee && (
        <PayrollDetails
          payslipId={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default PayrollSystem;