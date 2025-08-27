import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Menu } from "lucide-react";
import { ToastContainer } from "react-toastify";

//Client Portal Components
import Layout from "@/components/Layout";
import ClientProperties from "@/components/Properties";
import Favorites from "@/components/Favorites";
import Chat from "@/components/Chat";
import ClientNotifications from "@/components/Notifications";
import Settings from "@/components/Settings";
import { mockProperties } from "@/data/mockData";

// Pages
// Pages - Auth pages
import { LoginPage } from "@/pages/auth-pages/LoginPage";
import { SignupOptionsPage } from "@/pages/auth-pages/SignupOptionsPage";
import { AccountVerificationOptionsPage } from "@/pages/auth-pages/AccountVerificationOptionsPage";
import { TeamInvitePage } from "@/pages/TeamInvitePage";
import { PaymentPage } from "@/pages/PaymentPage";
import { VerificationPage } from "@/pages/auth-pages/VerificationPage";
import { CheckoutPage } from "@/pages/CheckoutPage";

// Pages - Workspace pages
import { WorkspaceDetailsPage } from "@/pages/workspace-pages/WorkspaceDetailsPage";
import { WorkspaceCreatedPage } from "@/pages/workspace-pages/WorkspaceCreatedPage";
import { WorkspaceNameSetupPage } from "@/pages/workspace-pages/WorkspaceNameSetupPage";
import { WorkspacePage } from "@/pages/workspace-pages/WorkspacePage";
import { WorkspaceViewPage } from "@/pages/workspace-pages/WorkspaceViewPage";
import { WorkspaceEditPage } from "@/pages/workspace-pages/WorkspaceEditPage";

// Components
import { AuthRedirect } from "@/components/AuthRedirect";
import { getCurrentUser as fetchCurrentUser } from "@/store/slices/authSlice";
import { setUser } from "@/store/slices/authSlice";

// Pages - Lead pages
import Leads from "@/pages/lead-pages/Leads";
import LeadForm from "@/pages/lead-pages/LeadForm";
import LeadFormTemplating from "@/pages/lead-pages/LeadFormTemplating";
import PublicLeadForm from "@/pages/PublicLeadForm";

// Pages - Client pages
import ClientSignUp from "@/pages/client-pages/clientSignUp";

// Realtor portal UI (pages)
import Sidebar from "@/pages/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import Clients from "@/pages/Clients";
import Analytics from "@/pages/Analytics";
import Tasks from "@/pages/Tasks";
import Documents from "@/pages/Documents";
import Marketing from "@/pages/Marketing";
import Calendar from "@/pages/Calendar";
import FollowupTemplating from "@/pages/FollowupTemplating";
import Followup from "@/pages/Followup";
import RealtorNotifications from "@/pages/Notifications";
import Messaging from "@/pages/Messaging";
import Realtors from "@/pages/Realtors";

const WorkspaceListPage = () => <div>All Workspaces Page</div>;

const ClientPortal: React.FC<{ initialPage?: string }> = ({
  initialPage = "properties",
}) => {
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
      case "properties":
        return <ClientProperties onToggleFavorite={toggleFavorite} />;
      case "favorites":
        return (
          <Favorites
            favoriteProperties={favoriteProperties}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "chat":
        return <Chat />;
      case "notifications":
        return <ClientNotifications />;
      case "settings":
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
const RealtorPortal: React.FC<{ initialSection?: string }> = ({
  initialSection = "dashboard",
}) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "properties":
        return <Properties />;
      case "clients":
        return <Clients />;
      case "realtors":
        return <Realtors />;
      case "analytics":
        return <Analytics />;
      case "leads":
        return <Leads />;
      case "tasks":
        return <Tasks />;
      case "documents":
        return <Documents />;
      case "marketing":
        return <Marketing />;
      case "calendar":
        return <Calendar />;
      case "followup-templating":
        return <FollowupTemplating />;
      case "followup":
        return <Followup />;
      case "leadform":
        return <LeadForm />;
      case "leadform-templating":
        return <LeadFormTemplating />;
      case "notifications":
        return <RealtorNotifications onNavigate={setActiveSection} />;
      case "messaging":
        return <Messaging />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-semibold text-gray-900">RealtyPro</span>
          </div>
          <div className="w-10"></div>
        </div>
        {renderSection()}
      </main>
    </div>
  );
};

function App() {
  // Check if we're on a workspace subdomain
  const isWorkspaceSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    console.log("Hostname:", hostname);
    console.log("Parts:", parts);

    // Check if it's a workspace subdomain (e.g., tenant-1.lvh.me)
    if (parts.length >= 3) {
      const baseDomain = parts.slice(-2).join(".");
      console.log("Base domain:", baseDomain);
      return baseDomain === "crm.localhost" && parts[0] !== "crm";
    }
    return false;
  };

  // Get workspace slug from subdomain (for future use)
  // const getWorkspaceSlug = () => {
  //   if (isWorkspaceSubdomain()) {
  //     return window.location.hostname.split('.')[0];
  //   }
  //   return null;
  // };

  // Protected route wrapper for workspace subdomains
  const WorkspaceProtectedRoute = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
      (state: any) => state.auth?.isAuthenticated
    );
    const token = useSelector((state: any) => state.auth?.token);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      let mounted = true;

      const hydrateFromServer = async () => {
        // If we already have auth in redux (token or isAuthenticated), skip server check
        if (token || isAuthenticated) {
          if (mounted) setChecking(false);
          return;
        }

        try {
          // Try to fetch current user using cookie-based session (backend sets httpOnly cookie)
          const resultAction: any = await dispatch(fetchCurrentUser() as any);
          if (resultAction?.payload?.data?.auth) {
            // populate main auth slice so UI sees user
            dispatch(setUser(resultAction.payload.data.auth));
          }
        } catch (err) {
          // no-op, not authenticated
        } finally {
          if (mounted) setChecking(false);
        }
      };

      hydrateFromServer();
      return () => {
        mounted = false;
      };
    }, [dispatch, token, isAuthenticated]);

    if (checking) return <div>Loading...</div>;

    // For development: allow access without token if on localhost
    const isDevelopment = window.location.hostname.includes("localhost");

    if (!token && !isAuthenticated && !isDevelopment) {
      return <LoginPage />;
    }

    if (!token && !isAuthenticated && isDevelopment) {
      console.warn(
        "Development mode: Accessing workspace without authentication token"
      );
    }

    return <>{children}</>;
  };

  const isWorkspace = isWorkspaceSubdomain();
  console.log("App routing - Is workspace subdomain:", isWorkspace);

  return (
    <AppProvider>
      <ToastContainer />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Client portal routes (always registered) */}
            <Route path="/client" element={<ClientPortal />} />
            <Route
              path="/client/favorites"
              element={<ClientPortal initialPage="favorites" />}
            />
            <Route
              path="/client/chat"
              element={<ClientPortal initialPage="chat" />}
            />
            <Route
              path="/client/notifications"
              element={<ClientPortal initialPage="notifications" />}
            />
            <Route
              path="/client/settings"
              element={<ClientPortal initialPage="settings" />}
            />

            {/* Workspace subdomain routes */}
            {isWorkspace ? (
              <>
                <Route
                  path="/"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/properties"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="properties" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/clients"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="clients" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/realtors"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="realtors" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/analytics"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="analytics" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/leads"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="leads" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/tasks"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="tasks" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/documents"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="documents" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/marketing"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="marketing" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/calendar"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="calendar" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/followup-templating"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="followup-templating" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/followup"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="followup" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/leadform"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="leadform" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/leadform-templating"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="leadform-templating" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/notifications"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="notifications" />
                    </WorkspaceProtectedRoute>
                  }
                />
                <Route
                  path="/realtor/messaging"
                  element={
                    <WorkspaceProtectedRoute>
                      <RealtorPortal initialSection="messaging" />
                    </WorkspaceProtectedRoute>
                  }
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/realtor" replace />} />
              </>
            ) : (
              <>
                {/* Main domain routes */}
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/form/:linkId" element={<PublicLeadForm />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup-options" element={<SignupOptionsPage />} />
                <Route path="/client-signup/:link" element={<ClientSignUp />} />
                <Route
                  path="/account-verification-options"
                  element={<AccountVerificationOptionsPage />}
                />
                <Route path="/team-invite" element={<TeamInvitePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/workspace-name-setup"
                  element={<WorkspaceNameSetupPage />}
                />
                <Route
                  path="/workspace-details"
                  element={<WorkspaceDetailsPage />}
                />
                <Route
                  path="/workspace-created"
                  element={<WorkspaceCreatedPage />}
                />
                <Route path="/workspace" element={<WorkspacePage />} />
                <Route path="/workspace/:id" element={<WorkspaceViewPage />} />
                <Route
                  path="/workspace/:id/edit"
                  element={<WorkspaceEditPage />}
                />
                <Route
                  path="/view-all-workspaces"
                  element={<WorkspaceListPage />}
                />

                {/* Realtor portal routes (prefixed) */}
                <Route path="/realtor" element={<RealtorPortal />} />
                <Route
                  path="/realtor/properties"
                  element={<RealtorPortal initialSection="properties" />}
                />
                <Route
                  path="/realtor/clients"
                  element={<RealtorPortal initialSection="clients" />}
                />
                <Route
                  path="/realtor/realtors"
                  element={<RealtorPortal initialSection="realtors" />}
                />
                <Route
                  path="/realtor/analytics"
                  element={<RealtorPortal initialSection="analytics" />}
                />
                <Route
                  path="/realtor/leads"
                  element={<RealtorPortal initialSection="leads" />}
                />
                <Route
                  path="/realtor/tasks"
                  element={<RealtorPortal initialSection="tasks" />}
                />
                <Route
                  path="/realtor/documents"
                  element={<RealtorPortal initialSection="documents" />}
                />
                <Route
                  path="/realtor/marketing"
                  element={<RealtorPortal initialSection="marketing" />}
                />
                <Route
                  path="/realtor/calendar"
                  element={<RealtorPortal initialSection="calendar" />}
                />
                <Route
                  path="/realtor/followup-templating"
                  element={
                    <RealtorPortal initialSection="followup-templating" />
                  }
                />
                <Route
                  path="/realtor/followup"
                  element={<RealtorPortal initialSection="followup" />}
                />
                <Route
                  path="/realtor/leadform"
                  element={<RealtorPortal initialSection="leadform" />}
                />
                <Route
                  path="/realtor/leadform-templating"
                  element={
                    <RealtorPortal initialSection="leadform-templating" />
                  }
                />
                <Route
                  path="/realtor/notifications"
                  element={<RealtorPortal initialSection="notifications" />}
                />
                <Route
                  path="/realtor/messaging"
                  element={<RealtorPortal initialSection="messaging" />}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
