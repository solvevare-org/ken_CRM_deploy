
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { 
  Plus, 
  Settings, 
  LogOut, 
  Building2, 
  Users, 
  Bell,
  Search,
  Menu
} from 'lucide-react';

export function WorkspacePage() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Removed unused showSignupOptions state
  // Removed unused viewMode state
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  // Removed unused handlers

  // Removed stats cards

  // Workspaces from context
  const workspaces = state.workspaces || [];

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
  {/* Removed stats cards */}

        {/* Workspaces Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Workspaces</h2>
          </div>
          <div className="p-6">
              {workspaces.length === 0 ? (
                <div className="text-gray-500">No workspaces created yet.</div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={() => navigate('/view-all-workspaces')}>
                      View All
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.map((ws) => (
                      <div key={ws.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{ws.name}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{ws.type === 'main' ? 'Main' : 'Sub'}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{ws.description}</div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{ws.memberCount} members</span>
                          </div>
                          <span>•</span>
                          <span>{new Date(ws.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Active Listings</span>
                            <span className="font-medium">{ws.activeListings}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Deals</span>
                            <span className="font-medium">{ws.totalDeals}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Monthly Revenue</span>
                            <span className="font-medium">${ws.monthlyRevenue}</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/workspace/${ws.id}`)}>
                            View
                          </Button>
                          <Button size="sm" onClick={() => navigate(`/workspace/${ws.id}/edit`)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => navigate('/signup-options')}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create a Workspace</h3>
                <p className="text-gray-600">Set up a new workspace for your projects</p>
              </div>
            </div>
          </div>
  {/* Signup Options Modal removed, navigation used instead */}
        </div>
      </main>
    </div>
  );
}