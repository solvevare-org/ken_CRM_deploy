import React, { useState } from 'react';
import { Search, Plus, Calendar, Clock, AlertCircle, CheckCircle, User } from 'lucide-react';

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const tasks = [
    {
      id: '1',
      title: 'Follow up with Jennifer Martinez',
      description: 'Call to discuss property preferences and schedule showing',
      type: 'follow-up',
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2024-01-25'),
      assignedTo: 'Sarah Johnson',
      clientId: '1',
      createdAt: new Date('2024-01-22')
    },
    {
      id: '2',
      title: 'Prepare listing documents for Oak Avenue',
      description: 'Complete all paperwork for new listing',
      type: 'paperwork',
      priority: 'medium',
      status: 'in-progress',
      dueDate: new Date('2024-01-24'),
      assignedTo: 'Sarah Johnson',
      propertyId: '2',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Property showing - Downtown Condo',
      description: 'Show property to potential buyers',
      type: 'showing',
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2024-01-26'),
      assignedTo: 'Sarah Johnson',
      propertyId: '1',
      createdAt: new Date('2024-01-21')
    },
    {
      id: '4',
      title: 'Create social media campaign',
      description: 'Design and launch marketing campaign for luxury villa',
      type: 'marketing',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date('2024-01-28'),
      assignedTo: 'Sarah Johnson',
      propertyId: '3',
      createdAt: new Date('2024-01-19')
    },
    {
      id: '5',
      title: 'Market analysis report',
      description: 'Prepare comparative market analysis for client',
      type: 'other',
      priority: 'low',
      status: 'completed',
      dueDate: new Date('2024-01-20'),
      assignedTo: 'Sarah Johnson',
      createdAt: new Date('2024-01-15'),
      completedAt: new Date('2024-01-20')
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const isOverdue = (dueDate: Date, status: string) => {
    return status !== 'completed' && new Date() > dueDate;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your daily activities and deadlines</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`bg-white p-4 lg:p-6 rounded-lg shadow-sm border ${
            isOverdue(task.dueDate, task.status) ? 'border-red-200 bg-red-50' : 'border-gray-100'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">{task.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1">{task.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {task.dueDate.toLocaleDateString()}
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {task.assignedTo}
                  </div>
                  <div className="capitalize">
                    Type: {task.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                {task.status !== 'completed' && (
                  <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Complete
                  </button>
                )}
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add a new task.</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;