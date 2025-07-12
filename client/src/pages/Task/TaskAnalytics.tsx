import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Task } from './TaskManagement';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TaskAnalyticsProps {
  tasks: Task[];
}

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  // Task Status Distribution
  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed', 'On Hold'],
    datasets: [
      {
        data: [
          tasks.filter(t => t.status === 'pending').length,
          tasks.filter(t => t.status === 'in-progress').length,
          tasks.filter(t => t.status === 'completed').length,
          tasks.filter(t => t.status === 'on-hold').length,
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Priority Distribution
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          tasks.filter(t => t.priority === 'high').length,
          tasks.filter(t => t.priority === 'medium').length,
          tasks.filter(t => t.priority === 'low').length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(251, 191, 36, 0.5)',
          'rgba(34, 197, 94, 0.5)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Productivity Metrics
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  const averageCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0) / completedTasks.length 
    : 0;

  const overdueTasks = tasks.filter(task => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    return deadline < today && task.status !== 'completed';
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Completion Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {averageCompletionTime.toFixed(1)}h
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overdue Tasks</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Efficiency</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalEstimatedHours > 0 ? Math.round((totalEstimatedHours / Math.max(totalActualHours, 1)) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <Bar data={priorityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Estimated Hours</span>
              <span className="font-medium">{totalEstimatedHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Actual Hours</span>
              <span className="font-medium">{totalActualHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Variance</span>
              <span className={`font-medium ${
                totalActualHours > totalEstimatedHours ? 'text-red-600' : 'text-green-600'
              }`}>
                {totalActualHours > totalEstimatedHours ? '+' : ''}
                {(totalActualHours - totalEstimatedHours).toFixed(1)}h
              </span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Efficiency Score</span>
                <span className="text-lg font-bold text-blue-600">
                  {totalEstimatedHours > 0 ? Math.round((totalEstimatedHours / Math.max(totalActualHours, 1)) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, totalEstimatedHours > 0 ? (totalEstimatedHours / Math.max(totalActualHours, 1)) * 100 : 0)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Insights */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Overdue Tasks</h4>
              <p className="text-sm text-yellow-700">
                {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} past deadline
              </p>
              {overdueTasks.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <li key={task.id} className="text-xs text-yellow-600">
                      • {task.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">High Priority Tasks</h4>
              <p className="text-sm text-blue-700">
                {tasks.filter(t => t.priority === 'high').length} high priority task{tasks.filter(t => t.priority === 'high').length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Recent Completions</h4>
              <p className="text-sm text-green-700">
                {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;