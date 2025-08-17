import React from 'react';
import { 
  DollarSign, 
  Building2, 
  Users, 
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$2,847,500',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      period: 'This month'
    },
    {
      title: 'Active Listings',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Building2,
      period: 'Current'
    },
    {
      title: 'Total Clients',
      value: '89',
      change: '+7',
      changeType: 'positive',
      icon: Users,
      period: 'Active'
    },
    {
      title: 'Properties Sold',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp,
      period: 'This year'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500">{stat.period}</span>
                </div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;