import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Home } from 'lucide-react';
import { ClientProperty } from '../types';

interface FavoritesProps {
  favoriteProperties: ClientProperty[];
  onToggleFavorite: (propertyId: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favoriteProperties, onToggleFavorite }) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Favorite Properties</h1>
        <p className="text-gray-600 mt-2">Properties you've saved for later review</p>
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite properties yet</h3>
          <p className="text-gray-600 mb-4">Start browsing properties and click the heart icon to save them here</p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <Home className="h-4 w-4 mr-2" />
            Browse Properties
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{favoriteProperties.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(favoriteProperties.reduce((acc, prop) => acc + prop.price, 0) / favoriteProperties.length)}
                  </p>
                </div>
                <div className="text-green-500 text-2xl font-bold">$</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favoriteProperties.filter(p => p.status === 'available').length}
                  </p>
                </div>
                <div className="text-blue-500 text-2xl font-bold">✓</div>
              </div>
            </div>
          </div>

          {/* Favorite Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
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
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Heart className="h-4 w-4" fill="white" />
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
        </>
      )}
    </div>
  );
};

export default Favorites;