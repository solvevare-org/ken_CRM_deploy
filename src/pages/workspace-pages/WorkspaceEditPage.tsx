import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Upload,
  Building2,
  Image as ImageIcon,
  Users,
  Tag,
  Plus,
  X,
} from "lucide-react";

export function WorkspaceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const workspace = state.workspaces?.find((ws) => ws.id === id);

  if (!workspace) {
    return (
      <div className="p-8 text-center text-gray-500">Workspace not found.</div>
    );
  }

  const [workspaceImage, setWorkspaceImage] = useState<string | null>(
    workspace.image || null
  );
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [memberCount, setMemberCount] = useState(workspace.memberCount || 1);
  const [roleTags, setRoleTags] = useState<string[]>(
    workspace.roleTags || ["Admin", "Manager", "Agent", "Trainee"]
  );
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

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          ...workspace,
          name: workspaceName,
          description,
          image: workspaceImage === null ? undefined : workspaceImage,
          memberCount,
          roleTags,
        },
      });
      setLoading(false);
      navigate(`/workspace/${workspace.id}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Workspace
            </h1>
          </div>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Workspace Summary Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Workspace Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Name</div>
                  <div className="font-medium text-gray-900">
                    {workspaceName}
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
            {/* Workspace Description */}
            <div>
              <Input
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter workspace description..."
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
                Member Count
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
