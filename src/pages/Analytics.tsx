import React from 'react';
import { TrendingUp, DollarSign, Home, Users, Target, Award } from 'lucide-react';

const Analytics: React.FC = () => {
  const kpis = [
    {
      title: 'Total Revenue',
      value: '$2,847,500',
      change: '+15.2%',
      changeType: 'positive',
      icon: DollarSign,
      period: 'vs last quarter'
    },
    {
      title: 'Properties Sold',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      icon: Home,
      period: 'this year'
    },
    {
      title: 'Active Clients',
      value: '89',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      period: 'total active'
    },
    {
      title: 'Avg. Sale Price',
      value: '$485K',
      change: '+8.5%',
      changeType: 'positive',
      icon: Target,
      period: 'median price'
    },
    {
      title: 'Commission Rate',
      value: '2.8%',
      change: '+0.3%',
      changeType: 'positive',
      icon: Award,
      period: 'average rate'
    },
    {
      title: 'Market Share',
      value: '12.4%',
      change: '+1.2%',
      changeType: 'positive',
      icon: TrendingUp,
      period: 'local market'
    }
  ];

  const salesByType = [
    { type: 'Single Family', value: 68, percentage: 43.6 },
    { type: 'Condos', value: 45, percentage: 28.8 },
    { type: 'Townhouses', value: 28, percentage: 17.9 },
    { type: 'Multi-Family', value: 15, percentage: 9.6 }
  ];

  const monthlyPerformance = [
    { month: 'Jan', sales: 12, revenue: 2100000 },
    { month: 'Feb', sales: 15, revenue: 2650000 },
    { month: 'Mar', sales: 18, revenue: 3200000 },
    { month: 'Apr', sales: 14, revenue: 2800000 },
    { month: 'May', sales: 21, revenue: 3800000 },
    { month: 'Jun', sales: 19, revenue: 3400000 }
  ];

  const maxRevenue = Math.max(...monthlyPerformance.map(m => m.revenue));

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Performance insights and business metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`text-sm font-medium ${
                      kpi.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500">{kpi.period}</span>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Monthly Performance */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <p className="text-sm text-gray-600">Sales count and revenue trends</p>
          </div>

          <div className="space-y-4">
            {monthlyPerformance.map((month, index) => (
              <div key={month.month} className="flex items-center space-x-4">
                <span className="w-8 text-sm font-medium text-gray-600">{month.month}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{month.sales} sales</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(month.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Property Type */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Sales by Property Type</h3>
            <p className="text-sm text-gray-600">Distribution of sold properties</p>
          </div>

          <div className="space-y-4">
            {salesByType.map((type, index) => (
              <div key={type.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-emerald-500' : 
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{type.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{type.value}</div>
                  <div className="text-xs text-gray-500">{type.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Properties</span>
              <span className="font-semibold text-gray-900">156</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-xl lg:text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-xl lg:text-2xl font-bold text-emerald-600">18</div>
            <div className="text-sm text-gray-600">Avg. Days on Market</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-xl lg:text-2xl font-bold text-purple-600">127%</div>
            <div className="text-sm text-gray-600">List to Sale Ratio</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-xl lg:text-2xl font-bold text-orange-600">8.2</div>
            <div className="text-sm text-gray-600">Avg. Showings per Sale</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;