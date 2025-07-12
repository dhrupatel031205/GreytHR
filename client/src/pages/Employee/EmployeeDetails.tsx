import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Building, User } from 'lucide-react';
import { Employee } from '../../contexts/EmployeeContext';
import { format } from 'date-fns';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {employee.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{employee.fullName}</h3>
                  <p className="text-blue-100">{employee.designation}</p>
                  <p className="text-blue-100 text-sm">{employee.department}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{employee.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{employee.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">{employee.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Born on {format(new Date(employee.dob), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Gender: </span>
                    <span className="text-sm text-gray-600 capitalize">{employee.gender}</span>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Work Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Employee ID: </span>
                    <span className="text-sm text-gray-600">{employee.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Department: </span>
                    <span className="text-sm text-gray-600">{employee.department}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Designation: </span>
                    <span className="text-sm text-gray-600">{employee.designation}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Role: </span>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date of Joining: </span>
                    <span className="text-sm text-gray-600">
                      {format(new Date(employee.doj), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status: </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Bank Name: </span>
                    <span className="text-sm text-gray-600">{employee.bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Account Number: </span>
                    <span className="text-sm text-gray-600">{employee.bankDetails.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">IFSC Code: </span>
                    <span className="text-sm text-gray-600">{employee.bankDetails.ifscCode}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name: </span>
                    <span className="text-sm text-gray-600">{employee.emergencyContact.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Relationship: </span>
                    <span className="text-sm text-gray-600">{employee.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{employee.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;