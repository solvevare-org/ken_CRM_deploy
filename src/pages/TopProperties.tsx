import React from 'react';
import { Building2, MapPin, DollarSign } from 'lucide-react';

const TopProperties: React.FC = () => {
  const properties = [
    {
      id: '1',
      title: 'Modern Downtown Condo',
      address: '123 Main Street, Suite 4B',
      price: 685000,
      views: 245,
      status: 'active',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Family Home with Garden',
      address: '456 Oak Avenue',
      price: 520000,
      views: 189,
      status: 'pending',
      image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Luxury Waterfront Villa',
      address: '789 Beach Road',
      price: 1250000,
      views: 312,
      status: 'active',
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Top Properties</h3>
          <p className="text-sm text-gray-600">Most viewed listings</p>
        </div>
        <Building2 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="group cursor-pointer">
            <div className="flex items-start space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src={property.image}
                alt={property.title}
                className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h4>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.address}</span>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex items-center text-sm font-semibold text-gray-900">
                    <DollarSign className="w-3 h-3" />
                    {(property.price / 1000).toFixed(0)}K
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">{property.views} views</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View all properties →
        </button>
      </div>
    </div>
  );
};

export default TopProperties;