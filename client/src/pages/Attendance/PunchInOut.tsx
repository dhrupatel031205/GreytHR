import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const PunchInOut: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [totalHours, setTotalHours] = useState('0h 0m');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Calculate total hours if punched in
      if (isPunchedIn && punchInTime) {
        const diff = new Date().getTime() - punchInTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTotalHours(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = () => {
    setIsPunchedIn(true);
    setPunchInTime(new Date());
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Time Display */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Current Time</h2>
        </div>
        <div className="text-4xl font-mono font-bold mb-2">
          {format(currentTime, 'HH:mm:ss')}
        </div>
        <div className="text-lg opacity-90">
          {format(currentTime, 'EEEE, MMMM dd, yyyy')}
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isPunchedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isPunchedIn ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            {isPunchedIn ? 'Checked In' : 'Not Checked In'}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Check In Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {punchInTime ? format(punchInTime, 'HH:mm') : '--:--'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Working Hours</p>
              <p className="text-lg font-semibold text-gray-900">{totalHours}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Expected Out</p>
              <p className="text-lg font-semibold text-gray-900">
                {punchInTime ? format(new Date(punchInTime.getTime() + 8.5 * 60 * 60 * 1000), 'HH:mm') : '--:--'}
              </p>
            </div>
          </div>

          {/* Punch Button */}
          <button
            onClick={isPunchedIn ? handlePunchOut : handlePunchIn}
            className={`w-full max-w-md py-4 px-8 rounded-lg text-white font-semibold text-lg transition-colors duration-200 ${
              isPunchedIn
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isPunchedIn ? 'Punch Out' : 'Punch In'}
          </button>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Current Location</p>
            <p className="text-sm text-gray-600">Office - Main Building, Floor 3</p>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Scheduled Hours</p>
            <p className="text-lg font-semibold text-gray-900">8h 30m</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Break Time</p>
            <p className="text-lg font-semibold text-gray-900">30m</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Overtime</p>
            <p className="text-lg font-semibold text-gray-900">0h 0m</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-lg font-semibold text-green-600">On Time</p>
          </div>
        </div>
      </div>

      {/* Recent Punches */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
        <div className="space-y-3">
          {[
            { date: 'Yesterday', checkIn: '09:00', checkOut: '18:30', hours: '8h 30m', status: 'Complete' },
            { date: 'Dec 23, 2024', checkIn: '09:15', checkOut: '18:15', hours: '8h 0m', status: 'Late' },
            { date: 'Dec 22, 2024', checkIn: '08:45', checkOut: '17:45', hours: '8h 30m', status: 'Complete' },
          ].map((record, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{record.date}</p>
                <p className="text-xs text-gray-600">{record.checkIn} - {record.checkOut}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{record.hours}</p>
                <p className={`text-xs ${
                  record.status === 'Complete' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {record.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PunchInOut;