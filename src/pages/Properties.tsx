import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MapPin, Bed, Bath, Square, ChevronRight, X} from 'lucide-react';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    budget: {
      min: '',
      max: ''
    },
    size: {
      min: '',
      max: ''
    },
    bedrooms: {
      min: '',
      max: ''
    },
    bathrooms: {
      min: '',
      max: ''
    },
    yearBuilt: {
      min: '',
      max: ''
    },
    propertyType: [] as string[],
    location: {
      city: '',
      state: '',
      postalCode: ''
    }
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    number_of_units: 1,
    price: '',
    status: 'Available',
    dimensions: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'USA'
    },
    description: '',
    images: [''],
    tags: [''],
    property_type: 'single_family',
    source_type: 'realtor',
    location: {
      latitude: '',
      longitude: ''
    },
    details: {
      beds: '',
      baths: '',
      baths_full: '',
      baths_half: '',
      sqft: '',
      lot_sqft: '',
      year_built: ''
    },
    media: {
      primary_photo: '',
      photo_count: 0
    },
    flags: {
      is_new_listing: true,
      is_pending: false,
      is_contingent: false,
      is_foreclosure: false,
      is_new_construction: false,
      is_plan: false,
      is_coming_soon: false,
      is_price_reduced: false
    }
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

  // Handle filter changes
  const handleFilterChange = (filterType: string, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handle property type filter (multi-select)
  const handlePropertyTypeFilter = (propertyType: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(propertyType)
        ? prev.propertyType.filter(type => type !== propertyType)
        : [...prev.propertyType, propertyType]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      budget: { min: '', max: '' },
      size: { min: '', max: '' },
      bedrooms: { min: '', max: '' },
      bathrooms: { min: '', max: '' },
      yearBuilt: { min: '', max: '' },
      propertyType: [],
      location: { city: '', state: '', postalCode: '' }
    });
  };

  // Apply filters
  const applyFilters = () => {
    setPagination({
      endCursor: '',
      hasNextPage: false,
      currentPage: 1
    });
    setShowFilters(false);
    fetchProperties();
  };

  // Handle view details
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any, nestedField?: string) => {
    if (nestedField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof typeof prev] as object),
          [nestedField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: any, i: number) => 
        i === index ? value : item
      )
    }));
  };

  // Add new item to array fields
  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      // Clean up form data - remove empty strings from arrays
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        details: {
          ...formData.details,
          beds: formData.details.beds ? parseInt(formData.details.beds) : undefined,
          baths: formData.details.baths ? parseInt(formData.details.baths) : undefined,
          baths_full: formData.details.baths_full ? parseInt(formData.details.baths_full) : undefined,
          baths_half: formData.details.baths_half ? parseInt(formData.details.baths_half) : undefined,
          sqft: formData.details.sqft ? parseInt(formData.details.sqft) : undefined,
          lot_sqft: formData.details.lot_sqft ? parseInt(formData.details.lot_sqft) : undefined,
          year_built: formData.details.year_built ? parseInt(formData.details.year_built) : undefined,
        },
        location: {
          latitude: formData.location.latitude ? parseFloat(formData.location.latitude) : undefined,
          longitude: formData.location.longitude ? parseFloat(formData.location.longitude) : undefined,
        },
        price: parseInt(formData.price),
        number_of_units: parseInt(formData.number_of_units.toString()),
        media: {
          ...formData.media,
          photo_count: formData.images.filter(img => img.trim() !== '').length
        }
      };

      // Remove undefined values
      const finalData = JSON.parse(JSON.stringify(cleanedData, (key, value) => 
        value === undefined ? undefined : value
      ));

      const response = await api.post('/api/property/add-property/', finalData);
      
      if (response.data.success) {
        // Close modal and refresh properties
        setShowAddModal(false);
        setFormData({
          name: '',
          number_of_units: 1,
          price: '',
          status: 'Available',
          dimensions: '',
          address: {
            street: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'USA'
          },
          description: '',
          images: [''],
          tags: [''],
          property_type: 'single_family',
          source_type: 'realtor',
          location: {
            latitude: '',
            longitude: ''
          },
          details: {
            beds: '',
            baths: '',
            baths_full: '',
            baths_half: '',
            sqft: '',
            lot_sqft: '',
            year_built: ''
          },
          media: {
            primary_photo: '',
            photo_count: 0
          },
          flags: {
            is_new_listing: true,
            is_pending: false,
            is_contingent: false,
            is_foreclosure: false,
            is_new_construction: false,
            is_plan: false,
            is_coming_soon: false,
            is_price_reduced: false
          }
        });
        fetchProperties(); // Refresh the properties list
      } else {
        throw new Error(response.data.message || 'Failed to add property');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add property');
      console.error('Error adding property:', err);
    } finally {
      setFormLoading(false);
    }
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
    // Basic search and status filter
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Budget filter
    const matchesBudget = (!filters.budget.min || property.price >= parseInt(filters.budget.min)) &&
                         (!filters.budget.max || property.price <= parseInt(filters.budget.max));
    
    // Size filter (square footage)
    const matchesSize = (!filters.size.min || (property.details?.sqft && property.details.sqft >= parseInt(filters.size.min))) &&
                       (!filters.size.max || (property.details?.sqft && property.details.sqft <= parseInt(filters.size.max)));
    
    // Bedrooms filter
    const matchesBedrooms = (!filters.bedrooms.min || (property.details?.beds && property.details.beds >= parseInt(filters.bedrooms.min))) &&
                           (!filters.bedrooms.max || (property.details?.beds && property.details.beds <= parseInt(filters.bedrooms.max)));
    
    // Bathrooms filter
    const matchesBathrooms = (!filters.bathrooms.min || (property.details?.baths && property.details.baths >= parseInt(filters.bathrooms.min))) &&
                            (!filters.bathrooms.max || (property.details?.baths && property.details.baths <= parseInt(filters.bathrooms.max)));
    
    // Year built filter
    const matchesYearBuilt = (!filters.yearBuilt.min || (property.details?.year_built && property.details.year_built >= parseInt(filters.yearBuilt.min))) &&
                            (!filters.yearBuilt.max || (property.details?.year_built && property.details.year_built <= parseInt(filters.yearBuilt.max)));
    
    // Property type filter
    const matchesPropertyType = filters.propertyType.length === 0 || 
                               filters.propertyType.includes(property.property_type);
    
    // Location filter
    const matchesLocation = (!filters.location.city || property.address.city.toLowerCase().includes(filters.location.city.toLowerCase())) &&
                           (!filters.location.state || property.address.state.toLowerCase().includes(filters.location.state.toLowerCase())) &&
                           (!filters.location.postalCode || property.address.postal_code.includes(filters.location.postalCode));
    
    return matchesSearch && matchesStatus && matchesBudget && matchesSize && 
           matchesBedrooms && matchesBathrooms && matchesYearBuilt && 
           matchesPropertyType && matchesLocation;
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
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
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
          </button>

          <button 
            onClick={handleSearch}
            className="inline-flex items-center px-3 lg:px-4 py-2 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-6">
              {/* Budget Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.budget.min}
                    onChange={(e) => handleFilterChange('budget', 'min', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.budget.max}
                    onChange={(e) => handleFilterChange('budget', 'max', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Range (sq ft)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.size.min}
                    onChange={(e) => handleFilterChange('size', 'min', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.size.max}
                    onChange={(e) => handleFilterChange('size', 'max', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.bedrooms.min}
                    onChange={(e) => handleFilterChange('bedrooms', 'min', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.bedrooms.max}
                    onChange={(e) => handleFilterChange('bedrooms', 'max', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bathrooms Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.bathrooms.min}
                    onChange={(e) => handleFilterChange('bathrooms', 'min', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.bathrooms.max}
                    onChange={(e) => handleFilterChange('bathrooms', 'max', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Year Built Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.yearBuilt.min}
                    onChange={(e) => handleFilterChange('yearBuilt', 'min', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.yearBuilt.max}
                    onChange={(e) => handleFilterChange('yearBuilt', 'max', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {['single_family', 'condo', 'townhouse', 'multi_family', 'land'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.propertyType.includes(type)}
                        onChange={() => handlePropertyTypeFilter(type)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={filters.location.city}
                    onChange={(e) => handleFilterChange('location', 'city', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={filters.location.state}
                    onChange={(e) => handleFilterChange('location', 'state', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={filters.location.postalCode}
                    onChange={(e) => handleFilterChange('location', 'postalCode', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="w-full sm:w-auto px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
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
                <button 
                  onClick={() => handleViewDetails(property)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
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

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-red-500 mr-2">⚠️</div>
                    <span className="text-red-700">{formError}</span>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter property name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                    <option value="Contingent">Contingent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single_family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi_family">Multi Family</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.number_of_units}
                    onChange={(e) => handleInputChange('number_of_units', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2500 sq ft"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address', e.target.value, 'street')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address', e.target.value, 'city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address', e.target.value, 'state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.postal_code}
                      onChange={(e) => handleInputChange('address', e.target.value, 'postal_code')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address', e.target.value, 'country')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.details.beds}
                      onChange={(e) => handleInputChange('details', e.target.value, 'beds')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.details.baths}
                      onChange={(e) => handleInputChange('details', e.target.value, 'baths')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.details.sqft}
                      onChange={(e) => handleInputChange('details', e.target.value, 'sqft')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lot Square Feet
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.details.lot_sqft}
                      onChange={(e) => handleInputChange('details', e.target.value, 'lot_sqft')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.details.year_built}
                      onChange={(e) => handleInputChange('details', e.target.value, 'year_built')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Year"
                    />
                  </div>
                </div>
              </div>

              {/* Location Coordinates */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.latitude}
                      onChange={(e) => handleInputChange('location', e.target.value, 'latitude')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 34.0736"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.longitude}
                      onChange={(e) => handleInputChange('location', e.target.value, 'longitude')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., -118.4004"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter image URL"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image URL
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                <div className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tag"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('tags', index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('tags')}
                    className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter property description..."
                />
              </div>

              {/* Property Flags */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Flags</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.flags).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('flags', e.target.checked, key)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Property'
                  )}
                </button>
              </div>
            </form>
          </div>
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedProperty.status)}`}>
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
                      <p className="text-lg font-bold text-gray-900">${selectedProperty.price.toLocaleString()}</p>
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

              {/* Statistics */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">View Count</label>
                    <p className="text-sm text-gray-900">{selectedProperty.view_count}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Inquiry Count</label>
                    <p className="text-sm text-gray-900">{selectedProperty.inquiry_count}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bookmark Count</label>
                    <p className="text-sm text-gray-900">{selectedProperty.bookmark_count}</p>
                  </div>
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