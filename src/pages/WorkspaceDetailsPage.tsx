import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Upload,
  Building2,
  Image as ImageIcon,
  Palette,
  Settings,
  Check
} from 'lucide-react';

export function WorkspaceDetailsPage() {
  const [workspaceImage, setWorkspaceImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const isFirstTime = state.user?.isFirstTime !== false;
  const isOrganization = state.signupType === 'organization';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWorkspaceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newWorkspace = {
        id: Date.now().toString(),
        name: state.workspaceName || 'My Workspace',
        description: description || 'New workspace',
        type: 'main' as const,
        createdAt: new Date().toISOString(),
        memberCount: 1,
        activeListings: 0,
        totalDeals: 0,
        monthlyRevenue: 0,
        image: workspaceImage,
        primaryColor,
        secondaryColor,
        isWhitelabel: isOrganization && !isFirstTime
      };
      
      dispatch({ type: 'ADD_WORKSPACE', payload: newWorkspace });
      setLoading(false);
      navigate('/workspace-created');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Customize Your Workspace
            </h1>
            <p className="text-gray-600">
              {isFirstTime 
                ? "Set up your workspace with standard organization template"
                : "Configure your workspace with whitelabel options"
              }
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-8">
            {/* Workspace Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Workspace Logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  {workspaceImage ? (
                    <img src={workspaceImage} alt="Workspace" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Upload Logo</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Input
                label="Description (Optional)"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workspace..."
                rows={3}
              />
            </div>

            {/* Whitelabel Configuration - Only for organizations and non-first-time users */}
            {isOrganization && !isFirstTime && (
              <div className="border-t pt-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Whitelabel Configuration</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Available</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Template Notice - For first-time users */}
            {isFirstTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Standard Organization Template</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your workspace will be set up with our standard template. 
                      Whitelabel customization will be available after your first workspace is created.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit"
              className="w-full"
              loading={loading}
            >
              Create Workspace
            </Button>
          </form>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}