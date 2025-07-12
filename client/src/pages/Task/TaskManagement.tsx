import React, { useState } from 'react';
import { Plus, Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TimesheetSubmission from './TimesheetSubmission';
import TaskAnalytics from './TaskAnalytics';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  deadline: string;
  createdAt: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
}

const TaskManagement: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'timesheet' | 'analytics'>('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Add login and registration functionality with JWT tokens',
      assignedTo: ['EMP001', 'EMP003'],
      assignedBy: 'HR Manager',
      priority: 'high',
      status: 'in-progress',
      deadline: '2024-12-30',
      createdAt: '2024-12-20',
      estimatedHours: 16,
      actualHours: 8,
      tags: ['frontend', 'backend', 'security'],
    },
    {
      id: '2',
      title: 'Design homepage mockups',
      description: 'Create wireframes and high-fidelity designs for the main landing page',
      assignedTo: ['EMP002'],
      assignedBy: 'Admin User',
      priority: 'medium',
      status: 'completed',
      deadline: '2024-12-25',
      createdAt: '2024-12-15',
      estimatedHours: 12,
      actualHours: 14,
      tags: ['design', 'ui/ux'],
    },
    {
      id: '3',
      title: 'Database optimization',
      description: 'Optimize database queries and add proper indexing',
      assignedTo: ['EMP001'],
      assignedBy: 'HR Manager',
      priority: 'medium',
      status: 'pending',
      deadline: '2025-01-05',
      createdAt: '2024-12-22',
      estimatedHours: 8,
      tags: ['backend', 'database'],
    },
  ]);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task & Timesheet Management</h1>
          <p className="text-gray-600">Assign tasks and track time submissions</p>
        </div>
        {(state.user?.role === 'admin' || state.user?.role === 'hr') && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Task Management
            </button>
            <button
              onClick={() => setActiveTab('timesheet')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timesheet'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timesheet Submission
            </button>
            {(state.user?.role === 'admin' || state.user?.role === 'hr') && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tasks' && <TaskList tasks={tasks} />}
          {activeTab === 'timesheet' && <TimesheetSubmission tasks={tasks} />}
          {activeTab === 'analytics' && <TaskAnalytics tasks={tasks} />}
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
};

export default TaskManagement;