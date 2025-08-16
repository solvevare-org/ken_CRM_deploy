// ...existing code...
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
const WorkspaceListPage = () => <div>All Workspaces Page</div>;
import { AccountVerificationOptionsPage } from './pages/AccountVerificationOptionsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;