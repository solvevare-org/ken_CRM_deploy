import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

// Define the backend data structure types
interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface PropertyLocation {
  latitude: number;
  longitude: number;
}

interface PropertyDetails {
  beds: number;
  baths: number;
  baths_full: number;
  baths_half: number;
  sqft: number;
  lot_sqft: number;
  year_built: number;
}

interface PropertyMedia {
  primary_photo: string;
  photo_count: number;
}

interface PropertyFlags {
  is_new_listing: boolean;
  is_pending: boolean;
  is_contingent: boolean;
  is_foreclosure: boolean;
  is_new_construction: boolean;
  is_plan: boolean;
  is_coming_soon: boolean;
  is_price_reduced: boolean;
}

interface Property {
  _id: string;
  name: string;
  price: number;
  status: string;
  property_type: string;
  source_type: string;
  realtor_id: string;
  view_count: number;
  inquiry_count: number;
  bookmark_count: number;
  listed_date: string;
  createdAt: string;
  advertisers: any[];
  fullAddress: string;
  id: string;
  address: PropertyAddress;
  location?: PropertyLocation;
  details?: PropertyDetails;
  media?: PropertyMedia;
  flags?: PropertyFlags;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: Property[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    role: string;
  };
  success: boolean;
}

const Properties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    endCursor: '',
    hasNextPage: false,
    currentPage: 1
  });

  // Fetch properties from backend
  const fetchProperties = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build the URL with cursor if provided
      let url = '/api/property/cursor';
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`;
      }

      const response = await api.get(url);
      const data: ApiResponse = response.data;
      
      if (data.success && data.data.items) {
        if (cursor) {
          // Append new properties for pagination
          setProperties(prev => [...prev, ...data.data.items]);
        } else {
          // Replace properties for new search/filter
          setProperties(data.data.items);
        }
        
        setPagination({
          endCursor: data.data.pageInfo.endCursor,
          hasNextPage: data.data.pageInfo.hasNextPage,
          currentPage: cursor ? pagination.currentPage + 1 : 1
        });
      } else {
        throw new Error(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, []);

  // Load more properties (pagination)
  const loadMoreProperties = () => {
    if (pagination.hasNextPage && pagination.endCursor) {
      fetchProperties(pagination.endCursor);
    }
  };

  // Reset and search properties
  const handleSearch = () => {
    setPagination({
      endCursor: '',
      hasNextPage: false,
      currentPage: 1
    });
    fetchProperties();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contingent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading && properties.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading properties...</h3>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <div className="text-6xl">⚠️</div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => fetchProperties()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="contingent">Contingent</option>
          </select>

          <button 
            onClick={handleSearch}
            className="inline-flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredProperties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative">
              <img
                src={property.media?.primary_photo || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={property.name}
                className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              {property.flags?.is_new_listing && (
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    New
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4 lg:p-6">
              <h3 className="font-semibold text-base lg:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.fullAddress}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {property.property_type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                {property.details?.beds && (
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.details.beds} beds
                  </div>
                )}
                {property.details?.baths && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.details.baths} baths
                  </div>
                )}
                {property.details?.sqft && (
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {property.details.sqft} sqft
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Listed: {new Date(property.listed_date).toLocaleDateString()}</span>
                <span>Source: {property.source_type.toUpperCase()}</span>
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

      {/* Pagination */}
      {pagination.hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={loadMoreProperties}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                Load More Properties
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add a new property.</p>
        </div>
      )}

      {/* Error Display */}
      {error && properties.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => fetchProperties()} 
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;