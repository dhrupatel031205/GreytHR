import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Calendar, User, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from './TaskManagement';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployee } from '../../contexts/EmployeeContext';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { state: authState } = useAuth();
  const { state: employeeState } = useEmployee();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    
    // Show only assigned tasks for employees
    if (authState.user?.role === 'employee') {
      const isAssigned = task.assignedTo.includes(authState.user.id);
      return matchesSearch && matchesStatus && matchesPriority && isAssigned;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getEmployee = (employeeId: string) => {
    return employeeState.employees.find(emp => emp.id === employeeId);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'on-hold':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div className="flex items-center text-sm text-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {filteredTasks.length} tasks found
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {(authState.user?.role === 'admin' || authState.user?.role === 'hr') && (
                  <>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={getStatusBadge(task.status)}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                </span>
                <span className={getPriorityBadge(task.priority)}>
                  <Flag className="h-3 w-3 inline mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                Assigned to: {task.assignedTo.length} member{task.assignedTo.length > 1 ? 's' : ''}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Estimated: {task.estimatedHours}h</span>
                {task.actualHours && (
                  <span>Actual: {task.actualHours}h</span>
                )}
              </div>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedTask(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.title}</h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={getStatusBadge(selectedTask.status)}>
                      {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={getPriorityBadge(selectedTask.priority)}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="text-sm text-gray-900">{format(new Date(selectedTask.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deadline</label>
                    <p className="text-sm text-gray-900">{format(new Date(selectedTask.deadline), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <div className="space-y-2">
                    {selectedTask.assignedTo.map((employeeId) => {
                      const employee = getEmployee(employeeId);
                      return employee ? (
                        <div key={employeeId} className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {employee.fullName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{employee.fullName}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                    <p className="text-sm text-gray-900">{selectedTask.estimatedHours} hours</p>
                  </div>
                  {selectedTask.actualHours && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Actual Hours</label>
                      <p className="text-sm text-gray-900">{selectedTask.actualHours} hours</p>
                    </div>
                  )}
                </div>

                {selectedTask.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;