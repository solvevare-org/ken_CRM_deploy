import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Bed, Bath, Square } from 'lucide-react';

const Properties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const properties = [
    {
      id: '1',
      title: 'Modern Downtown Condo',
      address: '123 Main Street, Suite 4B',
      price: 685000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      status: 'active',
      type: 'condo',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      dateAdded: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Family Home with Garden',
      address: '456 Oak Avenue',
      price: 520000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      status: 'pending',
      type: 'house',
      image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
      dateAdded: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Luxury Waterfront Villa',
      address: '789 Beach Road',
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      status: 'active',
      type: 'house',
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600',
      dateAdded: new Date('2024-01-20')
    },
    {
      id: '4',
      title: 'Cozy Townhouse',
      address: '321 Pine Street',
      price: 425000,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1100,
      status: 'sold',
      type: 'townhouse',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      dateAdded: new Date('2024-01-05')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your property listings</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>

          <button className="inline-flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>
            
            <div className="p-4 lg:p-6">
              <h3 className="font-semibold text-base lg:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.address}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  ${property.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms} beds
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  {property.bathrooms} baths
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  {property.sqft} sqft
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add a new property.</p>
        </div>
      )}
    </div>
  );
};

export default Properties;