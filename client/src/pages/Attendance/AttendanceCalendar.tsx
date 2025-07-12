import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock attendance data
  const attendanceData = {
    present: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24],
    absent: [4, 11, 18],
    late: [5, 12, 19],
    halfDay: [25, 26],
  };

  const getAttendanceStatus = (day: number) => {
    if (attendanceData.present.includes(day)) return 'present';
    if (attendanceData.absent.includes(day)) return 'absent';
    if (attendanceData.late.includes(day)) return 'late';
    if (attendanceData.halfDay.includes(day)) return 'half-day';
    return 'no-data';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'half-day':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Half Day</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month start */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={index} className="h-16 border border-gray-100 rounded-lg"></div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((day) => {
          const dayNumber = day.getDate();
          const status = getAttendanceStatus(dayNumber);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`h-16 border rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${getStatusColor(status)}`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span
                  className={`text-sm font-medium ${
                    isTodayDate ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                  }`}
                >
                  {dayNumber}
                </span>
                {status !== 'no-data' && (
                  <div className="w-2 h-2 rounded-full bg-current mt-1 opacity-60"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 capitalize">{getAttendanceStatus(selectedDate.getDate()).replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Check In:</span>
              <span className="ml-2">09:15 AM</span>
            </div>
            <div>
              <span className="text-gray-600">Check Out:</span>
              <span className="ml-2">06:30 PM</span>
            </div>
            <div>
              <span className="text-gray-600">Total Hours:</span>
              <span className="ml-2">8h 45m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;