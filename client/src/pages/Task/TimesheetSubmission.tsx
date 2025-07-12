import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Calendar, Clock, Save } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { toast } from 'react-toastify';
import { Task } from './TaskManagement';

const schema = yup.object({
  taskId: yup.string().required('Task is required'),
  date: yup.string().required('Date is required'),
  hours: yup.number().positive('Hours must be positive').max(24, 'Hours cannot exceed 24').required('Hours is required'),
  description: yup.string().required('Description is required'),
});

type TimesheetFormData = yup.InferType<typeof schema>;

interface TimesheetEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  date: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface TimesheetSubmissionProps {
  tasks: Task[];
}

const TimesheetSubmission: React.FC<TimesheetSubmissionProps> = ({ tasks }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    {
      id: '1',
      taskId: '1',
      taskTitle: 'Implement user authentication',
      date: '2024-12-23',
      hours: 8,
      description: 'Worked on JWT implementation and login form',
      status: 'submitted',
    },
    {
      id: '2',
      taskId: '2',
      taskTitle: 'Design homepage mockups',
      date: '2024-12-24',
      hours: 6,
      description: 'Created wireframes and initial designs',
      status: 'approved',
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimesheetFormData>({
    resolver: yupResolver(schema),
  });

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEntriesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return timesheetEntries.filter(entry => entry.date === dateStr);
  };

  const getTotalHoursForDate = (date: Date) => {
    return getEntriesForDate(date).reduce((total, entry) => total + entry.hours, 0);
  };

  const getTotalWeekHours = () => {
    return weekDays.reduce((total, day) => total + getTotalHoursForDate(day), 0);
  };

  const onSubmit = (data: TimesheetFormData) => {
    const task = tasks.find(t => t.id === data.taskId);
    const newEntry: TimesheetEntry = {
      id: Date.now().toString(),
      taskId: data.taskId,
      taskTitle: task?.title || '',
      date: data.date,
      hours: data.hours,
      description: data.description,
      status: 'draft',
    };

    setTimesheetEntries([...timesheetEntries, newEntry]);
    toast.success('Timesheet entry added successfully!');
    setShowForm(false);
    reset();
  };

  const submitTimesheet = () => {
    const draftEntries = timesheetEntries.filter(entry => entry.status === 'draft');
    if (draftEntries.length === 0) {
      toast.warning('No draft entries to submit');
      return;
    }

    setTimesheetEntries(entries =>
      entries.map(entry =>
        entry.status === 'draft' ? { ...entry, status: 'submitted' } : entry
      )
    );
    toast.success('Timesheet submitted for approval!');
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'submitted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Timesheet</h3>
          <p className="text-gray-600">
            Week of {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="flex space-x-4">
          <input
            type="week"
            value={format(selectedWeek, 'yyyy-\\WW')}
            onChange={(e) => {
              const [year, week] = e.target.value.split('-W');
              const date = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
              setSelectedWeek(date);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const entries = getEntriesForDate(day);
            const totalHours = getTotalHoursForDate(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={day.toISOString()}
                className={`p-4 rounded-lg border ${
                  isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-gray-900">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {format(day, 'dd')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {totalHours}h
                  </div>
                </div>
                <div className="space-y-1">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="text-xs p-2 bg-gray-100 rounded truncate"
                      title={entry.description}
                    >
                      <div className="font-medium">{entry.taskTitle}</div>
                      <div className="text-gray-600">{entry.hours}h</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            Total Week Hours: {getTotalWeekHours()}h
          </div>
          <button
            onClick={submitTimesheet}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Submit Timesheet</span>
          </button>
        </div>
      </div>

      {/* Detailed Entries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Timesheet Entries</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timesheetEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(entry.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {entry.taskTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {entry.hours}h
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(entry.status)}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Add Timesheet Entry</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task *
                    </label>
                    <select
                      {...register('taskId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a task</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                    {errors.taskId && (
                      <p className="mt-1 text-sm text-red-600">{errors.taskId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      {...register('date')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hours *
                    </label>
                    <input
                      {...register('hours')}
                      type="number"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="8"
                    />
                    {errors.hours && (
                      <p className="mt-1 text-sm text-red-600">{errors.hours.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe what you worked on..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetSubmission;