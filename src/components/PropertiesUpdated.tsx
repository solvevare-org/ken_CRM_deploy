import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, ChevronRight, X } from 'lucide-react';
import { ClientPropertyAPI, ClientPropertyApiResponse } from '../types';
import { BASE_URL } from '../config';

interface PropertiesProps {
  onToggleFavorite: (propertyId: string) => void;
}

const Properties: React.FC<PropertiesProps> = ({ onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(15000000);
  const [properties, setProperties] = useState<ClientPropertyAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    endCursor: '',
    hasNextPage: false,
    currentPage: 1
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<ClientPropertyAPI | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch properties from API with proper authentication
  const fetchProperties = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${BASE_URL}/api/property/cursor`;
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`;
      }

      console.log('Fetching properties from:', url);
      console.log('Current hostname:', window.location.hostname);
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
          'Host': window.location.hostname, // Include host header
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 500) {
          throw new Error('Server error: The properties service is currently unavailable. Please try again later.');
        } else if (response.status === 401) {
          throw new Error('Authentication error: Please log in again to view properties.');
        } else if (response.status === 403) {
          throw new Error('Access denied: You do not have permission to view properties.');
        } else {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data: ClientPropertyApiResponse = await response.json();
      console.log('API result:', data);
      
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
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties. Please check your connection and try again.');
      setProperties([]);
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

  // Handle view details
  const handleViewDetails = (property: ClientPropertyAPI) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
    setActiveTab('overview'); // Reset to overview tab
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'contingent':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || property.property_type === selectedType;
      const matchesPrice = property.price <= maxPrice;
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [properties, searchTerm, selectedType, maxPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading && properties.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Discover your perfect home from our curated listings</p>
        </div>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Discover your perfect home from our curated listings</p>
        </div>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-600 mt-2">Discover your perfect home from our curated listings</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Property Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="single_family">Single Family</option>
            <option value="multi_family">Multi Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
          </select>

          {/* Max Price */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Max Price:</label>
            <input
              type="range"
              min="100000"
              max="15000000"
              step="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {formatPrice(maxPrice)}
            </span>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredProperties.length} properties found
            </span>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <div className="relative">
              <img
                src={property.media?.primary_photo || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => onToggleFavorite(property._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </button>
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                {property.status}
              </div>
              {property.flags?.is_new_listing && (
                <div className="absolute top-3 left-16 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                  New
                </div>
              )}
              {property.flags?.is_price_reduced && (
                <div className="absolute top-3 left-24 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                  Reduced
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.fullAddress}</span>
              </div>

              <div className="flex items-center space-x-4 mb-3 text-gray-600">
                {property.details?.beds && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.details.beds} bed</span>
                  </div>
                )}
                {property.details?.baths && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.details.baths} bath</span>
                  </div>
                )}
                {property.details?.sqft && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.details.sqft.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Listed: {new Date(property.listed_date).toLocaleDateString()}</span>
                <span className="capitalize">{property.property_type.replace('_', ' ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewDetails(property)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
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

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Property Details Modal with Tabs */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Property Header */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h3>
                    <p className="text-lg text-gray-600">{selectedProperty.fullAddress}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{formatPrice(selectedProperty.price)}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedProperty.status)}`}>
                      {selectedProperty.status}
                    </div>
                  </div>
                </div>
                
                {/* Property Image */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={selectedProperty.media?.primary_photo || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={selectedProperty.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProperty.flags?.is_new_listing && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                        New
                      </span>
                    </div>
                  )}
                  {selectedProperty.flags?.is_price_reduced && (
                    <div className="absolute top-4 left-20">
                      <span className="px-2 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                        Price Reduced
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabbed Content */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex space-x-1 border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === 'details'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Property Details
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === 'location'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Location & Schools
                  </button>
                  <button
                    onClick={() => setActiveTab('financial')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === 'financial'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Financial & History
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Key Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedProperty.details?.beds && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedProperty.details.beds}</div>
                            <div className="text-sm text-gray-600">Bedrooms</div>
                          </div>
                        )}
                        {selectedProperty.details?.baths && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedProperty.details.baths}</div>
                            <div className="text-sm text-gray-600">Bathrooms</div>
                          </div>
                        )}
                        {selectedProperty.details?.sqft && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedProperty.details.sqft.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Square Feet</div>
                          </div>
                        )}
                        {selectedProperty.details?.lot_sqft && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedProperty.details.lot_sqft.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Lot Size (sq ft)</div>
                          </div>
                        )}
                        {selectedProperty.details?.year_built && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedProperty.details.year_built}</div>
                            <div className="text-sm text-gray-600">Year Built</div>
                          </div>
                        )}
                        {selectedProperty.details?.sub_type && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-lg font-semibold text-gray-800 capitalize">
                              {selectedProperty.details.sub_type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-600">Property Sub Type</div>
                          </div>
                        )}
                      </div>

                      {/* Property Flags */}
                      {selectedProperty.flags && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Property Features</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(selectedProperty.flags).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700 capitalize">
                                  {key.replace(/_/g, ' ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Property Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Basic Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedProperty.details?.beds && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Bedrooms</span>
                              <span className="font-medium">{selectedProperty.details.beds}</span>
                            </div>
                          )}
                          {selectedProperty.details?.baths && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Bathrooms</span>
                              <span className="font-medium">{selectedProperty.details.baths}</span>
                            </div>
                          )}
                          {selectedProperty.details?.baths_full && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Full Bathrooms</span>
                              <span className="font-medium">{selectedProperty.details.baths_full}</span>
                            </div>
                          )}
                          {selectedProperty.details?.baths_half && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Half Bathrooms</span>
                              <span className="font-medium">{selectedProperty.details.baths_half}</span>
                            </div>
                          )}
                          {selectedProperty.details?.sqft && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Square Feet</span>
                              <span className="font-medium">{selectedProperty.details.sqft.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedProperty.details?.lot_sqft && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Lot Size</span>
                              <span className="font-medium">{selectedProperty.details.lot_sqft.toLocaleString()} sq ft</span>
                            </div>
                          )}
                          {selectedProperty.details?.year_built && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Year Built</span>
                              <span className="font-medium">{selectedProperty.details.year_built}</span>
                            </div>
                          )}
                          {selectedProperty.details?.stories && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Stories</span>
                              <span className="font-medium">{selectedProperty.details.stories}</span>
                            </div>
                          )}
                          {selectedProperty.details?.units && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Units</span>
                              <span className="font-medium">{selectedProperty.details.units}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Media Information */}
                      {selectedProperty.media && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Media</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedProperty.media.photo_count && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Photo Count</span>
                                <span className="font-medium">{selectedProperty.media.photo_count}</span>
                              </div>
                            )}
                            {selectedProperty.media.virtual_tours !== undefined && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Virtual Tours</span>
                                <span className="font-medium">{selectedProperty.media.virtual_tours ? 'Available' : 'Not Available'}</span>
                              </div>
                            )}
                            {selectedProperty.media.matterport !== undefined && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Matterport</span>
                                <span className="font-medium">{selectedProperty.media.matterport ? 'Available' : 'Not Available'}</span>
                              </div>
                            )}
                            {selectedProperty.media.videos !== undefined && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Videos</span>
                                <span className="font-medium">{selectedProperty.media.videos ? 'Available' : 'Not Available'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location & Schools Tab */}
                  {activeTab === 'location' && (
                    <div className="space-y-6">
                      {/* Address Information */}
                      {selectedProperty.location?.address && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Address</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedProperty.location.address.line && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Street Address</span>
                                <span className="font-medium">{selectedProperty.location.address.line}</span>
                              </div>
                            )}
                            {selectedProperty.location.address.city && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">City</span>
                                <span className="font-medium">{selectedProperty.location.address.city}</span>
                              </div>
                            )}
                            {selectedProperty.location.address.state && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">State</span>
                                <span className="font-medium">{selectedProperty.location.address.state}</span>
                              </div>
                            )}
                            {selectedProperty.location.address.postal_code && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Postal Code</span>
                                <span className="font-medium">{selectedProperty.location.address.postal_code}</span>
                              </div>
                            )}
                            {selectedProperty.location.county?.name && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">County</span>
                                <span className="font-medium">{selectedProperty.location.county.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Neighborhood Information */}
                      {selectedProperty.location?.neighborhoods && selectedProperty.location.neighborhoods.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Neighborhoods</h4>
                          <div className="space-y-3">
                            {selectedProperty.location.neighborhoods.map((neighborhood, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="font-medium text-gray-900">{neighborhood.name}</div>
                                <div className="text-sm text-gray-600">{neighborhood.city} • {neighborhood.level}</div>
                                {neighborhood.geo_statistics?.housing_market && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Median Price: </span>
                                    {neighborhood.geo_statistics.housing_market.median_listing_price ? 
                                      formatPrice(neighborhood.geo_statistics.housing_market.median_listing_price) : 'N/A'}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Schools */}
                      {selectedProperty.schools && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Schools</h4>
                          
                          {/* Assigned Schools */}
                          {selectedProperty.schools.assigned && selectedProperty.schools.assigned.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-md font-medium text-gray-800 mb-2">Assigned Schools</h5>
                              <div className="space-y-2">
                                {selectedProperty.schools.assigned.map((school, index) => (
                                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div>
                                      <div className="font-medium text-gray-900">{school.name || 'School Name N/A'}</div>
                                      <div className="text-sm text-gray-600">{school.district?.name}</div>
                                    </div>
                                    {school.rating && (
                                      <div className="text-sm text-gray-600">Rating: {school.rating}/10</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Nearby Schools */}
                          {selectedProperty.schools.nearby && selectedProperty.schools.nearby.length > 0 && (
                            <div>
                              <h5 className="text-md font-medium text-gray-800 mb-2">Nearby Schools</h5>
                              <div className="space-y-2">
                                {selectedProperty.schools.nearby.slice(0, 5).map((school, index) => (
                                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div>
                                      <div className="font-medium text-gray-900">{school.name}</div>
                                      <div className="text-sm text-gray-600">
                                        {school.district?.name} • {school.distance_in_miles} miles away
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {school.rating && (
                                        <div className="text-sm text-gray-600">Rating: {school.rating}/10</div>
                                      )}
                                      <div className="text-xs text-gray-500">{school.education_levels?.join(', ')}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Financial & History Tab */}
                  {activeTab === 'financial' && (
                    <div className="space-y-6">
                      {/* Pricing Information */}
                      {selectedProperty.pricing && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedProperty.pricing.list_price && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">List Price</span>
                                <span className="font-medium">{formatPrice(selectedProperty.pricing.list_price)}</span>
                              </div>
                            )}
                            {selectedProperty.pricing.price_per_sqft && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Price per Sq Ft</span>
                                <span className="font-medium">${selectedProperty.pricing.price_per_sqft}</span>
                              </div>
                            )}
                            {selectedProperty.pricing.last_sold_price && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Last Sold Price</span>
                                <span className="font-medium">{formatPrice(selectedProperty.pricing.last_sold_price)}</span>
                              </div>
                            )}
                            {selectedProperty.pricing.last_sold_date && (
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Last Sold Date</span>
                                <span className="font-medium">
                                  {new Date(selectedProperty.pricing.last_sold_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Property History */}
                      {selectedProperty.property_history && selectedProperty.property_history.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Property History</h4>
                          <div className="space-y-3">
                            {selectedProperty.property_history.slice(0, 10).map((history, index) => (
                              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                                <div>
                                  <div className="font-medium text-gray-900">{history.event_name}</div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(history.date).toLocaleDateString()} • {history.source_name}
                                  </div>
                                </div>
                                {history.price && (
                                  <div className="text-right">
                                    <div className="font-medium text-gray-900">{formatPrice(history.price)}</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tax History */}
                      {selectedProperty.tax_history && selectedProperty.tax_history.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tax History</h4>
                          <div className="space-y-2">
                            {selectedProperty.tax_history.slice(0, 5).map((tax, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                  <div className="font-medium text-gray-900">{tax.year}</div>
                                  <div className="text-sm text-gray-600">
                                    Assessment: {formatPrice(tax.assessment?.total || 0)}
                                  </div>
                                </div>
                                <div className="text-right">
                                <div className="font-medium text-gray-900">{formatPrice(tax.tax || 0)}</div>
                                  <div className="text-sm text-gray-600">Annual Tax</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Property Estimates */}
                      {selectedProperty.estimates?.current_values && selectedProperty.estimates?.current_values.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Estimates</h4>
                          <div className="space-y-3">
                            {selectedProperty.estimates.current_values.map((estimate, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="font-medium text-gray-900 mb-2">{estimate.source.name}</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Estimate: </span>
                                    <span className="font-medium">{formatPrice(estimate.estimate)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Low: </span>
                                    <span className="font-medium">{formatPrice(estimate.estimate_low)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">High: </span>
                                    <span className="font-medium">{formatPrice(estimate.estimate_high)}</span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                  {new Date(estimate.date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
