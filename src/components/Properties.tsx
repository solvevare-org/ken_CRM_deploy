import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Phone, Mail, ChevronRight, X } from 'lucide-react';
import { ClientPropertyAPI, ClientPropertyApiResponse } from '../types';
import api from '../utils/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchBookmarks, 
  addBookmark, 
  removeBookmark,
  selectBookmarkedProperties,
  selectBookmarkLoading
} from '../store/slices/bookmarkSlice';

interface PropertiesProps {
  onToggleFavorite: (propertyId: string) => void;
}

const Properties: React.FC<PropertiesProps> = ({ onToggleFavorite }) => {
  const dispatch = useAppDispatch();
  const bookmarkedProperties = useAppSelector(selectBookmarkedProperties);
  const bookmarkLoading = useAppSelector(selectBookmarkLoading);

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

  // Fetch properties from API with proper authentication using axios
  const fetchProperties = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/property/cursor`;
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`;
      }

      console.log('Fetching properties from:', url);
      
      const response = await api.get(url);
      const data: ClientPropertyApiResponse = response.data;
      
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
    dispatch(fetchBookmarks());
  }, [dispatch]);

  // Load more properties (pagination)
  const loadMoreProperties = () => {
    if (pagination.hasNextPage && pagination.endCursor) {
      fetchProperties(pagination.endCursor);
    }
  };

  // Toggle bookmark for a property
  const toggleBookmark = async (propertyId: string) => {
    if (bookmarkLoading.has(propertyId)) return;

    const isBookmarked = bookmarkedProperties.has(propertyId);
    
    try {
      if (isBookmarked) {
        await dispatch(removeBookmark(propertyId)).unwrap();
      } else {
        await dispatch(addBookmark(propertyId)).unwrap();
      }
      
      // Call the parent onToggleFavorite for UI consistency
      onToggleFavorite(propertyId);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (property: ClientPropertyAPI) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
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

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                onClick={() => toggleBookmark(property._id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  bookmarkedProperties.has(property._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
                disabled={bookmarkLoading.has(property._id)}
              >
                {bookmarkLoading.has(property._id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                ) : (
                  <Heart className={`h-4 w-4 ${bookmarkedProperties.has(property._id) ? 'fill-current' : ''}`} />
                )}
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
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewDetails(property)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
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

      {/* Property Details Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Image */}
              <div className="relative">
                <img
                  src={selectedProperty.media?.primary_photo || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={selectedProperty.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProperty.status)}`}>
                    {selectedProperty.status}
                  </span>
                </div>
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

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Property Name</label>
                      <p className="text-sm text-gray-900">{selectedProperty.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(selectedProperty.price)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Property Type</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedProperty.property_type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Source Type</label>
                      <p className="text-sm text-gray-900 uppercase">{selectedProperty.source_type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Listed Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedProperty.listed_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created</label>
                      <p className="text-sm text-gray-900">{new Date(selectedProperty.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Address</label>
                      <p className="text-sm text-gray-900">{selectedProperty.fullAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Street</label>
                      <p className="text-sm text-gray-900">{selectedProperty.address.street}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="text-sm text-gray-900">{selectedProperty.address.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="text-sm text-gray-900">{selectedProperty.address.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <p className="text-sm text-gray-900">{selectedProperty.address.postal_code}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <p className="text-sm text-gray-900">{selectedProperty.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              {selectedProperty.details && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.beds || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.baths || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Bathrooms</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.baths_full || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Half Bathrooms</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.baths_half || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Square Feet</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.sqft ? `${selectedProperty.details.sqft.toLocaleString()} sq ft` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lot Square Feet</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.lot_sqft ? `${selectedProperty.details.lot_sqft.toLocaleString()} sq ft` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Year Built</label>
                      <p className="text-sm text-gray-900">{selectedProperty.details.year_built || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Coordinates */}
              {selectedProperty.location && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location Coordinates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <p className="text-sm text-gray-900">{selectedProperty.location.latitude}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <p className="text-sm text-gray-900">{selectedProperty.location.longitude}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Information */}
              {selectedProperty.media && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Primary Photo</label>
                      <p className="text-sm text-gray-900 break-all">{selectedProperty.media.primary_photo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Photo Count</label>
                      <p className="text-sm text-gray-900">{selectedProperty.media.photo_count}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Property Flags */}
              {selectedProperty.flags && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Flags</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedProperty.flags).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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