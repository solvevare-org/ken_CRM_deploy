import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Upload,
  Building2,
  Image as ImageIcon,
  Settings,
  Users,
  Tag,
  Plus,
  X,
} from "lucide-react";
import { CRM_BASE_DOMAIN } from "@/config";

export function WorkspaceDetailsPage() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const [workspaceImage, setWorkspaceImage] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [primaryColor] = useState("#3B82F6");
  const [secondaryColor] = useState("#10B981");
  const [memberCount, setMemberCount] = useState(1);
  const [roleTags, setRoleTags] = useState<string[]>([
    "Admin",
    "Manager",
    "Agent",
    "Trainee",
  ]);
  const [newRoleTag, setNewRoleTag] = useState("");
  const [loading, setLoading] = useState(false);

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

  const addRoleTag = () => {
    if (newRoleTag.trim() && !roleTags.includes(newRoleTag.trim())) {
      setRoleTags([...roleTags, newRoleTag.trim()]);
      setNewRoleTag("");
    }
  };

  const removeRoleTag = (tagToRemove: string) => {
    setRoleTags(roleTags.filter((tag) => tag !== tagToRemove));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newWorkspace = {
        id: Date.now().toString(),
        name: workspaceName || "My Workspace",
        description: "",
        type: "main" as const,
        createdAt: new Date().toISOString(),
        memberCount: memberCount,
        activeListings: 0,
        totalDeals: 0,
        monthlyRevenue: 0,
        image: workspaceImage || undefined,
        primaryColor,
        secondaryColor,
        roleTags,
        isWhitelabel: true,
      };

      dispatch({ type: "ADD_WORKSPACE", payload: newWorkspace });
      setLoading(false);
      // Redirect to tenant subdomain in dev to simulate wildcard DNS
      const slug =
        (workspaceName || "my-workspace")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "workspace";
      const protocol = window.location.protocol || "http:";
      const port = window.location.port ? `:${window.location.port}` : "";
      const targetUrl = `${protocol}//${slug}.${CRM_BASE_DOMAIN}${port}/`;
      if (window.location.hostname !== `${slug}.${CRM_BASE_DOMAIN}`) {
        window.location.assign(targetUrl);
      } else {
        navigate("/workspace-created");
      }
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
              {/* Removed isFirstTime conditional rendering */}? "Set up your
              workspace with standard organization template" : "Configure your
              workspace with whitelabel options"
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-8">
            {/* Workspace Summary Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Workspace Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Name</div>
                  <div className="font-medium text-gray-900">
                    {workspaceName || "My Workspace"}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Members</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {memberCount} members
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Role Tags</div>
                  <div className="font-medium text-gray-900">
                    {roleTags.length} roles defined
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Name */}
            <div>
              <Input
                label="Workspace Name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name..."
                required
              />
            </div>

            {/* Workspace Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Workspace Logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  {workspaceImage ? (
                    <img
                      src={workspaceImage}
                      alt="Workspace"
                      className="w-full h-full object-cover rounded-xl"
                    />
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
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Member Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Initial Member Count
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                  {memberCount}
                </span>
                <button
                  type="button"
                  onClick={() => setMemberCount(memberCount + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">members</span>
              </div>
            </div>

            {/* Role Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <Tag className="w-4 h-4 inline mr-2" />
                Role Tags
              </label>

              {/* Add new role tag */}
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  value={newRoleTag}
                  onChange={(e) => setNewRoleTag(e.target.value)}
                  placeholder="Add new role..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRoleTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addRoleTag}
                  size="sm"
                  className="px-3"
                  disabled={!newRoleTag.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Display role tags */}
              <div className="flex flex-wrap gap-2">
                {roleTags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeRoleTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {roleTags.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No role tags added yet
                </p>
              )}
            </div>

            {/* Whitelabel Configuration section removed as requested */}

            {/* Template Notice */}
            {/* Template Notice removed (was conditional on isFirstTime) */}

            <Button type="submit" className="w-full" loading={loading}>
              Create Workspace
            </Button>
          </form>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/checkout")}
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
