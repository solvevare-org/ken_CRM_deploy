import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  UserCheck, 
  Shield, 
  ShieldOff, 
  UserX, 
  MoreHorizontal,
  User
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BASE_URL } from '../config';

interface Realtor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_pic: string | null;
  role: string;
  isAdmin: boolean;
}

const Realtors: React.FC = () => {
  const [realtors, setRealtors] = useState<Realtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRealtor, setSelectedRealtor] = useState<Realtor | null>(null);
  const [confirmAction, setConfirmAction] = useState<'makeAdmin' | 'removeAdmin' | 'remove'>('remove');

  // Fetch realtors from API
  useEffect(() => {
    const fetchRealtors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/realtor/realtors`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setRealtors(result.data || []);
        } else {
          console.error('Failed to fetch realtors');
        }
      } catch (error) {
        console.error('Error fetching realtors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtors();
  }, []);

  // Filter realtors based on search term
  const filteredRealtors = realtors.filter((realtor) =>
    `${realtor.first_name} ${realtor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    realtor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Placeholder handlers for actions
  const handleMakeAdmin = (realtor: Realtor) => {
    setSelectedRealtor(realtor);
    setConfirmAction('makeAdmin');
    setShowConfirmModal(true);
  };

  const handleRemoveAdmin = (realtor: Realtor) => {
    setSelectedRealtor(realtor);
    setConfirmAction('removeAdmin');
    setShowConfirmModal(true);
  };

  const handleRemoveFromWorkspace = (realtor: Realtor) => {
    setSelectedRealtor(realtor);
    setConfirmAction('remove');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRealtor) return;

    // TODO: Implement actual API calls
    console.log(`${confirmAction} for realtor:`, selectedRealtor.id);
    
    setShowConfirmModal(false);
    setSelectedRealtor(null);
  };

  const handleAddRealtor = () => {
    // TODO: Implement add realtor functionality
    console.log('Add realtor clicked');
  };

  const getActionText = () => {
    switch (confirmAction) {
      case 'makeAdmin':
        return 'make this user an admin';
      case 'removeAdmin':
        return 'remove admin privileges from this user';
      case 'remove':
        return 'remove this user from the workspace';
      default:
        return 'perform this action';
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading realtors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Realtors</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">
            Manage workspace members and their permissions
          </p>
        </div>
        <Button
          onClick={handleAddRealtor}
          className="mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Realtor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search realtors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Realtors</p>
              <p className="text-2xl font-bold text-gray-900">{realtors.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {realtors.filter(r => r.isAdmin).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {realtors.filter(r => !r.isAdmin).length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{realtors.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Realtors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realtor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRealtors.map((realtor) => (
                <tr key={realtor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {realtor.profile_pic ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={realtor.profile_pic}
                            alt={`${realtor.first_name} ${realtor.last_name}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {realtor.first_name} {realtor.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {realtor.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {realtor.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        {realtor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      realtor.isAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {realtor.isAdmin ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 mr-1" />
                          {realtor.role}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {!realtor.isAdmin ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMakeAdmin(realtor)}
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Make Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAdmin(realtor)}
                          className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                          <ShieldOff className="w-3 h-3 mr-1" />
                          Remove Admin
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromWorkspace(realtor)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRealtor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserX className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Action
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {getActionText()} <strong>
                          {selectedRealtor.first_name} {selectedRealtor.last_name}
                        </strong>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleConfirmAction}
                  className="w-full sm:w-auto sm:ml-3 bg-red-600 hover:bg-red-700"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedRealtor(null);
                  }}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Realtors;
