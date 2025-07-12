import React from 'react';
import { X, Download, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface PayrollDetailsProps {
  payslipId: string;
  onClose: () => void;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ payslipId, onClose }) => {
  // Mock payslip data
  const payslip = {
    id: payslipId,
    employee: {
      name: 'John Doe',
      id: 'EMP001',
      department: 'Engineering',
      designation: 'Senior Developer',
      email: 'john.doe@greyhr.com',
      joiningDate: '2020-01-15',
    },
    payPeriod: {
      month: 'December',
      year: '2024',
      workingDays: 22,
      actualDays: 20,
    },
    earnings: {
      basicSalary: 3000,
      hra: 1500,
      transportAllowance: 200,
      specialAllowance: 300,
      bonus: 500,
    },
    deductions: {
      pf: 360,
      esi: 75,
      tax: 450,
      loan: 0,
      other: 0,
    },
    companyInfo: {
      name: 'GreytHR Technologies',
      address: '123 Business Street, Tech City, TC 12345',
      phone: '+1-234-567-8900',
      email: 'info@greyhr.com',
    },
  };

  const totalEarnings = Object.values(payslip.earnings).reduce((sum, value) => sum + value, 0);
  const totalDeductions = Object.values(payslip.deductions).reduce((sum, value) => sum + value, 0);
  const netSalary = totalEarnings - totalDeductions;

  const downloadPDF = () => {
    const pdf = new jsPDF();
    
    // Company Header
    pdf.setFontSize(20);
    pdf.text(payslip.companyInfo.name, 20, 30);
    pdf.setFontSize(10);
    pdf.text(payslip.companyInfo.address, 20, 40);
    pdf.text(`Phone: ${payslip.companyInfo.phone} | Email: ${payslip.companyInfo.email}`, 20, 50);
    
    // Title
    pdf.setFontSize(16);
    pdf.text('Salary Slip', 20, 70);
    
    // Employee Details
    pdf.setFontSize(12);
    pdf.text(`Employee: ${payslip.employee.name}`, 20, 90);
    pdf.text(`Employee ID: ${payslip.employee.id}`, 20, 100);
    pdf.text(`Department: ${payslip.employee.department}`, 20, 110);
    pdf.text(`Designation: ${payslip.employee.designation}`, 20, 120);
    pdf.text(`Pay Period: ${payslip.payPeriod.month} ${payslip.payPeriod.year}`, 20, 130);
    
    // Earnings
    let yPos = 150;
    pdf.text('EARNINGS', 20, yPos);
    yPos += 10;
    Object.entries(payslip.earnings).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      pdf.text(`${label}: $${value}`, 30, yPos);
      yPos += 10;
    });
    pdf.text(`Total Earnings: $${totalEarnings}`, 20, yPos + 5);
    
    // Deductions
    yPos += 25;
    pdf.text('DEDUCTIONS', 20, yPos);
    yPos += 10;
    Object.entries(payslip.deductions).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      pdf.text(`${label}: $${value}`, 30, yPos);
      yPos += 10;
    });
    pdf.text(`Total Deductions: $${totalDeductions}`, 20, yPos + 5);
    
    // Net Salary
    yPos += 20;
    pdf.setFontSize(14);
    pdf.text(`NET SALARY: $${netSalary}`, 20, yPos);
    
    pdf.save(`payslip_${payslip.employee.id}_${payslip.payPeriod.month}_${payslip.payPeriod.year}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Payslip Details</h2>
            <div className="flex space-x-2">
              <button
                onClick={downloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Company Header */}
            <div className="text-center mb-8 bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">{payslip.companyInfo.name}</h3>
              </div>
              <p className="text-gray-600">{payslip.companyInfo.address}</p>
              <p className="text-gray-600">{payslip.companyInfo.phone} | {payslip.companyInfo.email}</p>
              <h4 className="text-xl font-semibold text-gray-900 mt-4">Salary Slip</h4>
            </div>

            {/* Employee & Pay Period Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {payslip.employee.name}</div>
                  <div><span className="font-medium">Employee ID:</span> {payslip.employee.id}</div>
                  <div><span className="font-medium">Department:</span> {payslip.employee.department}</div>
                  <div><span className="font-medium">Designation:</span> {payslip.employee.designation}</div>
                  <div><span className="font-medium">Email:</span> {payslip.employee.email}</div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Pay Period Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Month:</span> {payslip.payPeriod.month} {payslip.payPeriod.year}</div>
                  <div><span className="font-medium">Working Days:</span> {payslip.payPeriod.workingDays}</div>
                  <div><span className="font-medium">Actual Days:</span> {payslip.payPeriod.actualDays}</div>
                  <div><span className="font-medium">LOP Days:</span> {payslip.payPeriod.workingDays - payslip.payPeriod.actualDays}</div>
                </div>
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Earnings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                  <h4 className="font-semibold">Earnings</h4>
                </div>
                <div className="p-4">
                  {Object.entries(payslip.earnings).map(([key, value]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700">{label}</span>
                        <span className="font-medium">${value.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between py-3 mt-3 border-t-2 border-green-600 font-semibold text-green-700">
                    <span>Total Earnings</span>
                    <span>${totalEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg">
                  <h4 className="font-semibold">Deductions</h4>
                </div>
                <div className="p-4">
                  {Object.entries(payslip.deductions).map(([key, value]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700">{label}</span>
                        <span className="font-medium">${value.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between py-3 mt-3 border-t-2 border-red-600 font-semibold text-red-700">
                    <span>Total Deductions</span>
                    <span>${totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Net Salary</h3>
              <p className="text-3xl font-bold">${netSalary.toLocaleString()}</p>
              <p className="text-blue-100 mt-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netSalary)} Only
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>This is a computer-generated payslip and does not require a signature.</p>
              <p className="mt-1">For any queries, please contact HR department at hr@greyhr.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;