import React from 'react';
import { Plus, Calendar, Users, FileText } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Add Property',
      description: 'List a new property',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => console.log('Add property clicked')
    },
    {
      title: 'Schedule Showing',
      description: 'Book appointment',
      icon: Calendar,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      onClick: () => console.log('Schedule showing clicked')
    },
    {
      title: 'Add Client',
      description: 'New client contact',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => console.log('Add client clicked')
    },
    {
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => console.log('Generate report clicked')
    }
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600">Frequently used tools</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white p-3 lg:p-4 rounded-lg transition-colors group text-left`}
            >
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 mb-2" />
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs opacity-90">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;