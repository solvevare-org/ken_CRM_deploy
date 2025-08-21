// ...existing code...
import { useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function WorkspaceViewPage() {
  const { id } = useParams();
  const { state } = useAppContext();
  const workspace = state.workspaces?.find(ws => ws.id === id);

  if (!workspace) {
    return <div className="p-8 text-center text-gray-500">Workspace not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
            <p className="text-gray-600">{workspace.description}</p>
          </div>
        </div>
        <div className="mb-4 flex items-center space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{workspace.memberCount} members</span>
          <span>•</span>
          <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active Listings</span>
            <span className="font-medium">{workspace.activeListings}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Deals</span>
            <span className="font-medium">{workspace.totalDeals}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monthly Revenue</span>
            <span className="font-medium">${workspace.monthlyRevenue}</span>
          </div>
        </div>
        <Button size="sm" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
