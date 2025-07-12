import React, { useState } from 'react';
import { Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployee } from '../../contexts/EmployeeContext';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: employeeState } = useEmployee();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const currentEmployee = employeeState.employees.find(emp => emp.id === authState.user?.id);

  if (!currentEmployee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee profile not found</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditedData({
      fullName: currentEmployee.fullName,
      email: currentEmployee.email,
      phone: currentEmployee.phone,
      address: currentEmployee.address,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically update the employee data
    console.log('Saving profile changes:', editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Edit className="h-5 w-5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {currentEmployee.fullName.charAt(0)}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{currentEmployee.fullName}</h2>
              <p className="text-blue-100">{currentEmployee.designation}</p>
              <p className="text-blue-100 text-sm">{currentEmployee.department}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.fullName || currentEmployee.fullName}
                      onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentEmployee.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.email || currentEmployee.email}
                        onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-900">{currentEmployee.email}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phone || currentEmployee.phone}
                        onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-900">{currentEmployee.phone}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {format(new Date(currentEmployee.dob), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <span className="text-gray-900 capitalize">{currentEmployee.gender}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    {isEditing ? (
                      <textarea
                        value={editedData.address || currentEmployee.address}
                        onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                        rows={3}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-900">{currentEmployee.address}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Work Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <p className="text-gray-900">{currentEmployee.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-gray-900">{currentEmployee.department}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <p className="text-gray-900">{currentEmployee.designation}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {currentEmployee.role.charAt(0).toUpperCase() + currentEmployee.role.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Joining
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {format(new Date(currentEmployee.doj), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Status
                  </label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    currentEmployee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentEmployee.status.charAt(0).toUpperCase() + currentEmployee.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <p className="text-gray-900">{currentEmployee.bankDetails.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <p className="text-gray-900">****{currentEmployee.bankDetails.accountNumber.slice(-4)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <p className="text-gray-900">{currentEmployee.bankDetails.ifscCode}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <p className="text-gray-900">{currentEmployee.emergencyContact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <p className="text-gray-900">{currentEmployee.emergencyContact.relationship}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{currentEmployee.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;