import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Properties from './components/Properties';
import Favorites from './components/Favorites';
import Chat from './components/Chat';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import { mockProperties } from './data/mockData';
import { Property } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('properties');
  const [properties, setProperties] = useState<Property[]>(mockProperties);

  const favoriteProperties = useMemo(() => 
    properties.filter(property => property.isFavorited),
    [properties]
  );

  const toggleFavorite = (propertyId: string) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, isFavorited: !property.isFavorited }
          : property
      )
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'properties':
        return <Properties onToggleFavorite={toggleFavorite} />;
      case 'favorites':
        return <Favorites favoriteProperties={favoriteProperties} onToggleFavorite={toggleFavorite} />;
      case 'chat':
        return <Chat />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Properties onToggleFavorite={toggleFavorite} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;