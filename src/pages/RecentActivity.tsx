import React from 'react';
import { 
  Clock, 
  Home, 
  User, 
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'sale',
      title: 'Property Sold - 123 Oak Street',
      description: 'Sold to Michael Chen for $485,000',
      time: '2 hours ago',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      id: '2',
      type: 'listing',
      title: 'New Listing Added',
      description: '456 Pine Ave - $650,000 Modern Condo',
      time: '4 hours ago',
      icon: Home,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      id: '3',
      type: 'client',
      title: 'New Client Registered',
      description: 'Emma Wilson looking for 3BR house',
      time: '6 hours ago',
      icon: User,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    {
      id: '4',
      type: 'showing',
      title: 'Property Showing Scheduled',
      description: 'Tomorrow 2:00 PM - 789 Maple Drive',
      time: '1 day ago',
      icon: Calendar,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50'
    },
    {
      id: '5',
      type: 'view',
      title: 'Property Views Increased',
      description: '234 Elm Street received 15 new views',
      time: '2 days ago',
      icon: Eye,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600">Latest updates on your business</p>
        </div>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${activity.iconBg} flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View all activities →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;