import React from 'react';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import PropertyChart from './PropertyChart';
import QuickActions from './QuickActions';
import TopProperties from './TopProperties';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Welcome back, Sarah! Here's your business overview.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <PropertyChart />
          <RecentActivity />
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-4 lg:space-y-6">
          <QuickActions />
          <TopProperties />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;