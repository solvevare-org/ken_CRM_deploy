import React, { useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, Home } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchBookmarks, 
  removeBookmark,
  selectBookmarksData,
  selectBookmarksLoading,
  selectBookmarkLoading
} from '../store/slices/bookmarkSlice';

interface FavoritesProps {
  onToggleFavorite: (propertyId: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onToggleFavorite }) => {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector(selectBookmarksData);
  const loading = useAppSelector(selectBookmarksLoading);
  const bookmarkLoading = useAppSelector(selectBookmarkLoading);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const handleRemoveBookmark = async (propertyId: string) => {
    if (bookmarkLoading.has(propertyId)) return;
    
    try {
      await dispatch(removeBookmark(propertyId)).unwrap();
      onToggleFavorite(propertyId);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };
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

      {!loading && bookmarks.length === 0 ? (
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
                  <p className="text-2xl font-bold text-gray-900">{bookmarks.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookmarks.length > 0 ? formatPrice(bookmarks.reduce((acc, bookmark) => acc + bookmark.property.price, 0) / bookmarks.length) : '$0'}
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
                    {bookmarks.filter(b => b.property.status === 'Available').length}
                  </p>
                </div>
                <div className="text-blue-500 text-2xl font-bold">✓</div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading bookmarked properties...</h3>
            </div>
          )}

          {/* Favorite Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => {
              const property = bookmark.property;
              return (
                <div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="relative">
                  <img
                    src={property.media?.primary_photo || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveBookmark(property._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    disabled={bookmarkLoading.has(property._id)}
                  >
                    {bookmarkLoading.has(property._id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Heart className="h-4 w-4" fill="white" />
                    )}
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

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Bookmarked: {new Date(bookmark.bookmarked_at).toLocaleDateString()}</span>
                    <span>{bookmark.age_in_days} days ago</span>
                  </div>

                  {/* Contact Actions */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Contact Agent</p>
                        <p className="text-sm text-gray-600">Get more information</p>
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
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;