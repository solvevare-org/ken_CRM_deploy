import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Phone, Mail } from 'lucide-react';
import { ClientProperty } from '../types';
import { mockProperties } from '../data/mockData';

interface PropertiesProps {
  onToggleFavorite: (propertyId: string) => void;
}

const Properties: React.FC<PropertiesProps> = ({ onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [properties] = useState<ClientProperty[]>(mockProperties);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || property.type === selectedType;
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
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>

          {/* Max Price */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Max Price:</label>
            <input
              type="range"
              min="200000"
              max="1500000"
              step="50000"
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
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => onToggleFavorite(property.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  property.isFavorited 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className="h-4 w-4" fill={property.isFavorited ? 'white' : 'none'} />
              </button>
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                property.status === 'available' ? 'bg-green-100 text-green-800' :
                property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center space-x-4 mb-3 text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bedrooms} bed</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bathrooms} bath</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.area.toLocaleString()} sqft</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

              {/* Agent Info */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{property.agent.name}</p>
                    <p className="text-sm text-gray-600">Your Agent</p>
                  </div>
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

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Properties;