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
import ClientProperties from './components/Properties';
import Favorites from './components/Favorites';
import Chat from './components/Chat';
import ClientNotifications from './components/Notifications';
import Settings from './components/Settings';
import { mockProperties } from './data/mockData';

// Realtor portal UI
import { Sidebar } from './components/layout/Sidebar';

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
        return <ClientProperties onToggleFavorite={toggleFavorite} />;
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
        return <ClientNotifications />;
      case 'settings':
        return <Settings />;
      default:
        return <ClientProperties onToggleFavorite={toggleFavorite} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

// Realtor Portal (prefixed routes under /realtor)
const RealtorPortal: React.FC<{ initialSection?: string }> = ({ initialSection = 'dashboard' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeSection} onTabChange={setActiveSection} />
      <main className="flex-1">
        <div className="border-b bg-white px-4 py-3">{/* Top bar placeholder */}</div>
        <div className="p-4">
          {activeSection === 'dashboard' && <div>Realtor Dashboard</div>}
          {activeSection === 'properties' && <div>Realtor Properties</div>}
          {activeSection === 'clients' && <div>Realtor Clients</div>}
          {activeSection === 'analytics' && <div>Realtor Analytics</div>}
          {activeSection === 'leads' && <div>Realtor Leads</div>}
          {activeSection === 'tasks' && <div>Realtor Tasks</div>}
          {activeSection === 'documents' && <div>Realtor Documents</div>}
          {activeSection === 'marketing' && <div>Realtor Marketing</div>}
          {activeSection === 'calendar' && <div>Realtor Calendar</div>}
          {activeSection === 'followup-templating' && <div>Realtor Follow-up Templating</div>}
          {activeSection === 'followup' && <div>Realtor Follow-up</div>}
          {activeSection === 'leadform' && <div>Realtor Lead Form</div>}
          {activeSection === 'leadform-templating' && <div>Realtor Lead Form Templating</div>}
          {activeSection === 'notifications' && <div>Realtor Notifications</div>}
          {activeSection === 'messaging' && <div>Realtor Messaging</div>}
        </div>
      </main>
    </div>
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

            {/* Realtor portal routes (prefixed) */}
            <Route path="/realtor" element={<RealtorPortal />} />
            <Route path="/realtor/properties" element={<RealtorPortal initialSection="properties" />} />
            <Route path="/realtor/clients" element={<RealtorPortal initialSection="clients" />} />
            <Route path="/realtor/analytics" element={<RealtorPortal initialSection="analytics" />} />
            <Route path="/realtor/leads" element={<RealtorPortal initialSection="leads" />} />
            <Route path="/realtor/tasks" element={<RealtorPortal initialSection="tasks" />} />
            <Route path="/realtor/documents" element={<RealtorPortal initialSection="documents" />} />
            <Route path="/realtor/marketing" element={<RealtorPortal initialSection="marketing" />} />
            <Route path="/realtor/calendar" element={<RealtorPortal initialSection="calendar" />} />
            <Route path="/realtor/followup-templating" element={<RealtorPortal initialSection="followup-templating" />} />
            <Route path="/realtor/followup" element={<RealtorPortal initialSection="followup" />} />
            <Route path="/realtor/leadform" element={<RealtorPortal initialSection="leadform" />} />
            <Route path="/realtor/leadform-templating" element={<RealtorPortal initialSection="leadform-templating" />} />
            <Route path="/realtor/notifications" element={<RealtorPortal initialSection="notifications" />} />
            <Route path="/realtor/messaging" element={<RealtorPortal initialSection="messaging" />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;