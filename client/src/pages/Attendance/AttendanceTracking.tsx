import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Edit, Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import AttendanceCalendar from './AttendanceCalendar';
import PunchInOut from './PunchInOut';
import AttendanceList from './AttendanceList';

const AttendanceTracking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'punch'>('calendar');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600">Monitor and manage employee attendance</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Present</p>
              <p className="text-2xl font-bold text-green-600">85</p>
              <p className="text-sm text-gray-500">+5 from yesterday</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Absent</p>
              <p className="text-2xl font-bold text-red-600">15</p>
              <p className="text-sm text-gray-500">-2 from yesterday</p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Late Arrivals</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-sm text-gray-500">Same as yesterday</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Hours/Day</p>
              <p className="text-2xl font-bold text-blue-600">8.5</p>
              <p className="text-sm text-gray-500">+0.5 from last week</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Today's Attendance
            </button>
            <button
              onClick={() => setActiveTab('punch')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'punch'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Punch In/Out
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'calendar' && (
            <AttendanceCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
          {activeTab === 'list' && <AttendanceList />}
          {activeTab === 'punch' && <PunchInOut />}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;