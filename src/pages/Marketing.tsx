import React, { useState } from 'react';
import { Search, Plus, TrendingUp, Eye, MousePointer, Users, DollarSign } from 'lucide-react';

const Marketing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const campaigns = [
    {
      id: '1',
      name: 'Luxury Waterfront Villa Campaign',
      type: 'social',
      status: 'active',
      propertyIds: ['3'],
      targetAudience: 'High-income professionals, 35-55',
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1200,
      leads: 18,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15')
    },
    {
      id: '2',
      name: 'Downtown Condo Email Series',
      type: 'email',
      status: 'active',
      propertyIds: ['1'],
      targetAudience: 'First-time buyers, 25-35',
      budget: 1500,
      spent: 800,
      impressions: 12000,
      clicks: 480,
      leads: 12,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Family Homes Print Campaign',
      type: 'print',
      status: 'completed',
      propertyIds: ['2', '4'],
      targetAudience: 'Families with children',
      budget: 3000,
      spent: 3000,
      impressions: 25000,
      clicks: 0,
      leads: 8,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31')
    },
    {
      id: '4',
      name: 'Investment Properties Online Ads',
      type: 'online',
      status: 'paused',
      propertyIds: ['5', '6'],
      targetAudience: 'Real estate investors',
      budget: 4000,
      spent: 2100,
      impressions: 32000,
      clicks: 890,
      leads: 15,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-02-10')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-50 text-blue-700';
      case 'social':
        return 'bg-purple-50 text-purple-700';
      case 'print':
        return 'bg-orange-50 text-orange-700';
      case 'online':
        return 'bg-emerald-50 text-emerald-700';
      case 'direct-mail':
        return 'bg-indigo-50 text-indigo-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateROI = (leads: number, spent: number) => {
    const avgLeadValue = 5000; // Estimated average lead value
    const revenue = leads * avgLeadValue;
    return spent > 0 ? ((revenue - spent) / spent * 100).toFixed(1) : '0';
  };

  const totalStats = campaigns.reduce((acc, campaign) => ({
    budget: acc.budget + campaign.budget,
    spent: acc.spent + campaign.spent,
    impressions: acc.impressions + campaign.impressions,
    clicks: acc.clicks + campaign.clicks,
    leads: acc.leads + campaign.leads
  }), { budget: 0, spent: 0, impressions: 0, clicks: 0, leads: 0 });

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Marketing</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage marketing campaigns and track performance</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-xl font-bold text-gray-900">${totalStats.budget.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impressions</p>
              <p className="text-xl font-bold text-gray-900">{totalStats.impressions.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clicks</p>
              <p className="text-xl font-bold text-gray-900">{totalStats.clicks.toLocaleString()}</p>
            </div>
            <MousePointer className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads</p>
              <p className="text-xl font-bold text-gray-900">{totalStats.leads}</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
              <p className="text-xl font-bold text-gray-900">
                {totalStats.impressions > 0 ? ((totalStats.clicks / totalStats.impressions) * 100).toFixed(2) : '0'}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                    {campaign.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{campaign.targetAudience}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div>Budget: ${campaign.budget.toLocaleString()}</div>
                  <div>Spent: ${campaign.spent.toLocaleString()}</div>
                  <div>Duration: {campaign.startDate.toLocaleDateString()} - {campaign.endDate?.toLocaleDateString()}</div>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 lg:ml-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Impressions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{campaign.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{campaign.leads}</p>
                    <p className="text-xs text-gray-500">Leads</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-600">+{calculateROI(campaign.leads, campaign.spent)}%</p>
                    <p className="text-xs text-gray-500">ROI</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  {campaign.status === 'active' && (
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Pause
                    </button>
                  )}
                  {campaign.status === 'paused' && (
                    <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      Resume
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {campaign.propertyIds.length} {campaign.propertyIds.length === 1 ? 'property' : 'properties'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">Try adjusting your search filters or create a new campaign.</p>
        </div>
      )}
    </div>
  );
};

export default Marketing;