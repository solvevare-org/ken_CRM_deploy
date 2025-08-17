import React from 'react';
import { BarChart3 } from 'lucide-react';

const PropertyChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const salesData = [850000, 920000, 1100000, 980000, 1250000, 1400000];
  const maxValue = Math.max(...salesData);

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Monthly Sales</h3>
          <p className="text-sm text-gray-600">Revenue trends over time</p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {months.map((month, index) => (
          <div key={month} className="flex items-center space-x-4">
            <span className="w-6 lg:w-8 text-xs lg:text-sm font-medium text-gray-600">{month}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(salesData[index] / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs lg:text-sm font-semibold text-gray-900 w-16 lg:w-20 text-right">
              ${(salesData[index] / 1000)}K
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Average monthly revenue: <span className="font-semibold text-gray-900">${(salesData.reduce((a, b) => a + b, 0) / salesData.length / 1000).toFixed(0)}K</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyChart;