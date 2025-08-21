
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { BASE_URL, CRM_BASE_DOMAIN } from '../config';
import { 
  Plus, 
  Settings, 
  LogOut, 
  Building2, 
  Users, 
  Bell,
  Search,
  Menu,
  Check,
  X,
  Calendar
} from 'lucide-react';

export function WorkspacePage() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personalWorkspaces, setPersonalWorkspaces] = useState<any[]>([]);
  const [organizationWorkspaces, setOrganizationWorkspaces] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  // Fetch workspaces from API
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/workspaces/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          const workspaces = result.data || [];
          
          // Separate workspaces by type and invitation status
          const personal = workspaces.filter((ws: any) => ws.type === 'personal' && !ws.invitedPending);
          const organization = workspaces.filter((ws: any) => ws.type === 'organization' && !ws.invitedPending);
          const pending = workspaces.filter((ws: any) => ws.invitedPending);
          
          setPersonalWorkspaces(personal);
          setOrganizationWorkspaces(organization);
          setPendingInvites(pending);
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Navigate to workspace subdomain
  const handleWorkspaceClick = (workspace: any) => {
    const slug = workspace.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    // Remove the .crm part from the domain to navigate directly to workspace subdomain
    const baseDomain = 'localhost';
    const targetUrl = `${protocol}//${slug}.${baseDomain}${port}/realtor`;
    
    window.location.assign(targetUrl);
  };

  // Placeholder handlers for pending invites
  const handleAcceptInvite = (inviteId: string) => {
    console.log('Accept invite:', inviteId);
    // TODO: Implement accept invite logic
  };

  const handleDeclineInvite = (inviteId: string) => {
    console.log('Decline invite:', inviteId);
    // TODO: Implement decline invite logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {state.currentWorkspace?.name || 'Workspace'}
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, tasks, members..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            {/* Right section */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {state.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button 
                      onClick={() => navigate('/workspace-details')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Workspaces</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading workspaces...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personal Workspaces Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Personal Workspace</h2>
                <p className="text-sm text-gray-600 mt-1">Your individual workspace for personal projects</p>
              </div>
              <div className="p-6">
                {personalWorkspaces.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No personal workspace found</p>
                    <Button onClick={() => navigate('/workspace-details')}>
                      Create Personal Workspace
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personalWorkspaces.map((ws) => (
                      <WorkspaceCard
                        key={ws.id}
                        workspace={ws}
                        onClick={() => handleWorkspaceClick(ws)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Organization Workspaces Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Organization Workspaces</h2>
                  <p className="text-sm text-gray-600 mt-1">Shared workspaces for team collaboration</p>
                </div>
                <Button 
                  onClick={() => navigate('/workspace-details')}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Workspace</span>
                </Button>
              </div>
              <div className="p-6">
                {organizationWorkspaces.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No organization workspaces found</p>
                    <p className="text-sm text-gray-400">Click "Add Workspace" above to create your first organization workspace</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizationWorkspaces.map((ws) => (
                      <WorkspaceCard
                        key={ws.id}
                        workspace={ws}
                        onClick={() => handleWorkspaceClick(ws)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Invites Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pending Invites</h2>
                <p className="text-sm text-gray-600 mt-1">Workspace invitations waiting for your response</p>
              </div>
              <div className="p-6">
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending invites</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {invite.white_label_configurations?.logo_path ? (
                              <img 
                                src={invite.white_label_configurations.logo_path} 
                                alt={invite.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{invite.name}</h3>
                            <p className="text-sm text-gray-600">
                              <span className={`px-2 py-1 text-xs rounded-full ${invite.type === 'personal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {invite.type}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">Role: {invite.role || 'Member'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptInvite(invite.id)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineInvite(invite.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


          </div>
        )}
      </main>
    </div>
  );
}

// Workspace Card Component
interface WorkspaceCardProps {
  workspace: any;
  onClick: () => void;
}

function WorkspaceCard({ workspace, onClick }: WorkspaceCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      trialing: 'bg-blue-100 text-blue-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      canceled: 'bg-red-100 text-red-800',
      incomplete: 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.incomplete;
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      basic: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };
    return planConfig[plan as keyof typeof planConfig] || planConfig.basic;
  };

  return (
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {workspace.white_label_configurations?.logo_path ? (
            <img 
              src={workspace.white_label_configurations.logo_path} 
              alt={workspace.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900 truncate">{workspace.name}</h3>
            <p className="text-xs text-gray-500">
              {workspace.isAdmin ? 'Administrator' : workspace.role || 'Member'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 text-xs rounded-full ${workspace.type === 'personal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {workspace.type}
          </span>
          {workspace.invitedPending && (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
              Pending
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {workspace.payment_account && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getPlanBadge(workspace.payment_account.plan_type)}`}>
                {workspace.payment_account.plan_type}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(workspace.payment_account.subscription_status)}`}>
                {workspace.payment_account.subscription_status}
              </span>
            </div>
            {workspace.payment_account.current_period_end && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Renewal</span>
                <span className="font-medium text-gray-900">
                  {new Date(workspace.payment_account.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}
          </>
        )}
        
        {/* Role Information */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Your Role</span>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            workspace.isAdmin 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {workspace.isAdmin ? 'Admin' : workspace.role || 'Member'}
          </span>
        </div>

        {/* Features Status */}
        {workspace.white_label_configurations?.features_disabled && workspace.white_label_configurations.features_disabled.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Disabled Features</span>
            <span className="text-xs text-orange-600">
              {workspace.white_label_configurations.features_disabled.length} disabled
            </span>
          </div>
        )}

        {workspace.createdAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Created</span>
            <span className="font-medium text-gray-900">
              {new Date(workspace.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {workspace.updatedAt && (
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Last updated {new Date(workspace.updatedAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}