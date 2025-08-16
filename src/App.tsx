import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Auth and Workspace Management Components
import { LoginPage } from './pages/LoginPage';
import { SignupOptionsPage } from './pages/SignupOptionsPage';
import { TeamInvitePage } from './pages/TeamInvitePage';
import { PaymentPage } from './pages/PaymentPage';
import { VerificationPage } from './pages/VerificationPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WorkspaceDetailsPage } from './pages/WorkspaceDetailsPage';
import { WorkspaceCreatedPage } from './pages/WorkspaceCreatedPage';
import { WorkspaceNameSetupPage } from './pages/WorkspaceNameSetupPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { WorkspaceViewPage } from './pages/WorkspaceViewPage';
import { WorkspaceEditPage } from './pages/WorkspaceEditPage';
import { AccountVerificationOptionsPage } from './pages/AccountVerificationOptionsPage';

//Client Portal Components
import Layout from './components/Layout';
import Properties from './components/Properties';
import Favorites from './components/Favorites';
import Chat from './components/Chat';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import { mockProperties } from './data/mockData';

const WorkspaceListPage = () => <div>All Workspaces Page</div>;

const ClientPortal: React.FC<{ initialPage?: string }> = ({ initialPage = 'properties' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [properties, setProperties] = useState<any[]>(mockProperties as any[]);

  const favoriteProperties = useMemo(
    () => properties.filter((property: any) => property.isFavorited),
    [properties]
  );

  const toggleFavorite = (propertyId: string) => {
    setProperties((prevProperties: any[]) =>
      prevProperties.map((property: any) =>
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
        return (
          <Favorites
            favoriteProperties={favoriteProperties}
            onToggleFavorite={toggleFavorite}
          />
        );
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
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Auth/Workspace routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup-options" element={<SignupOptionsPage />} />
            <Route path="/account-verification-options" element={<AccountVerificationOptionsPage />} />
            <Route path="/team-invite" element={<TeamInvitePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/workspace-name-setup" element={<WorkspaceNameSetupPage />} />
            <Route path="/workspace-details" element={<WorkspaceDetailsPage />} />
            <Route path="/workspace-created" element={<WorkspaceCreatedPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/workspace/:id" element={<WorkspaceViewPage />} />
            <Route path="/workspace/:id/edit" element={<WorkspaceEditPage />} />
            <Route path="/view-all-workspaces" element={<WorkspaceListPage />} />

            {/* Client portal routes (prefixed) */}
            <Route path="/client" element={<ClientPortal />} />
            <Route path="/client/favorites" element={<ClientPortal initialPage="favorites" />} />
            <Route path="/client/chat" element={<ClientPortal initialPage="chat" />} />
            <Route path="/client/notifications" element={<ClientPortal initialPage="notifications" />} />
            <Route path="/client/settings" element={<ClientPortal initialPage="settings" />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;