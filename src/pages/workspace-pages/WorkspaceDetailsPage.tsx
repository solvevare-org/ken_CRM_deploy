import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Upload, Building2, Image as ImageIcon, Settings, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { CRM_BASE_DOMAIN, BASE_URL } from '../../config';

export function WorkspaceDetailsPage() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const [workspaceImage, setWorkspaceImage] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [primaryColor] = useState('#3B82F6');
  const [secondaryColor] = useState('#10B981');
  const [signatureFiles, setSignatureFiles] = useState<File[]>([]);
  const [disabledFeatures, setDisabledFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameValidation, setNameValidation] = useState<{
    isValid: boolean;
    isChecking: boolean;
    message: string;
  }>({ isValid: true, isChecking: false, message: "" });

  // Available features that can be disabled
  const availableFeatures = [
    { id: "dashboard", label: "Dashboard" },
    { id: "properties", label: "Properties" },
    { id: "clients", label: "Clients" },
    { id: "realtors", label: "Realtors" },
    { id: "analytics", label: "Analytics" },
    { id: "leads", label: "Leads" },
    { id: "tasks", label: "Tasks" },
    { id: "documents", label: "Documents" },
    { id: "marketing", label: "Campaigns" },
    { id: "calendar", label: "Calendar" },
    { id: "followup", label: "Follow-up" },
    { id: "followup-templating", label: "Follow-up Templating" },
    { id: "leadform", label: "Lead Form" },
    { id: "leadform-templating", label: "Lead Form Templating" },
    { id: "notifications", label: "Notifications" },
    { id: "messaging", label: "Messages" },
  ];

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

  // Validate workspace name
  const validateWorkspaceName = (name: string) => {
    // Check for invalid characters
    const invalidChars = /[*+=\$%\^&()!@]/;
    if (invalidChars.test(name)) {
      return {
        isValid: false,
        message:
          "Workspace name cannot contain special characters like *, +, =, $, %, ^, &, (, ), !, @",
      };
    }

    // Check length
    if (name.length < 3 || name.length > 50) {
      return {
        isValid: false,
        message: "Workspace name must be between 3 and 50 characters",
      };
    }

    return { isValid: true, message: "" };
  };

  // Check workspace name availability
  const checkWorkspaceAvailability = async (name: string) => {
    if (!name.trim()) return;

    const validation = validateWorkspaceName(name);
    if (!validation.isValid) {
      setNameValidation({
        isValid: false,
        isChecking: false,
        message: validation.message,
      });
      return;
    }

    setNameValidation({
      isValid: true,
      isChecking: true,
      message: "Checking availability...",
    });

    try {
      // Convert name to slug format
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const response = await fetch(
        `${BASE_URL}/api/workspaces/check-exist?name=${slug}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.data?.available) {
          setNameValidation({
            isValid: true,
            isChecking: false,
            message: result.data.message || "This workspace name is available",
          });
        } else {
          setNameValidation({
            isValid: false,
            isChecking: false,
            message:
              "This workspace name is already taken. Please choose a different name.",
          });
        }
      } else {
        setNameValidation({
          isValid: false,
          isChecking: false,
          message: "Unable to check name availability. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error checking workspace availability:", error);
      setNameValidation({
        isValid: false,
        isChecking: false,
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  // Debounced name validation
  useEffect(() => {
    if (workspaceName.trim()) {
      const timer = setTimeout(() => {
        checkWorkspaceAvailability(workspaceName);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setNameValidation({ isValid: true, isChecking: false, message: "" });
    }
  }, [workspaceName]);

  // Handle signature file uploads
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSignatureFiles((prev) => [...prev, ...files]);
  };

  const removeSignatureFile = (index: number) => {
    setSignatureFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle feature selection
  const toggleFeature = (featureId: string) => {
    setDisabledFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!nameValidation.isValid || nameValidation.isChecking) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newWorkspace = {
        id: Date.now().toString(),
        name: workspaceName || "My Workspace",
        description: "",
        type: "main" as const,
        createdAt: new Date().toISOString(),
        memberCount: 1, // Default to 1 member (the creator)
        activeListings: 0,
        totalDeals: 0,
        monthlyRevenue: 0,
        image: workspaceImage || undefined,
        primaryColor,
        secondaryColor,
        signatureFiles: signatureFiles.map((file) => file.name),
        disabledFeatures,
        isWhitelabel: true,
      };

      dispatch({ type: "ADD_WORKSPACE", payload: newWorkspace });
      setLoading(false);

      // Redirect to tenant subdomain in dev to simulate wildcard DNS
      const slug =
        workspaceName
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
              Create Organization Workspace
            </h1>
            <p className="text-gray-600">
              Set up a new organization workspace with custom branding and features
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
                    {workspaceName || 'Organization Workspace'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Signatures</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {signatureFiles.length} files
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-gray-600 mb-1">Disabled Features</div>
                  <div className="font-medium text-gray-900">
                    {disabledFeatures.length} features disabled
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Name */}
            <div>
              <div className="mb-2">
                <Input
                  label="Workspace Name"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name..."
                  required
                />
              </div>

              {/* Name Validation Feedback */}
              {workspaceName.trim() && (
                <div className="mt-2 flex items-center space-x-2">
                  {nameValidation.isChecking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600">
                        {nameValidation.message}
                      </span>
                    </>
                  ) : nameValidation.isValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {nameValidation.message}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        {nameValidation.message}
                      </span>
                    </>
                  )}
                </div>
              )}
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

            {/* Signature Files Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <FileText className="w-4 h-4 inline mr-2" />
                Signature Files
              </label>
              <div className="space-y-4">
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Upload Signature Files
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF files up to 5MB each
                  </p>
                </div>

                {/* Display uploaded signature files */}
                {signatureFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Files:
                    </p>
                    <div className="space-y-2">
                      {signatureFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({Math.round(file.size / 1024)}KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSignatureFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <Settings className="w-4 h-4 inline mr-2" />
                Disable Features
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Select features you want to disable in this workspace. Disabled
                features will not be accessible to workspace members.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                  <label
                    key={feature.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={disabledFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      {feature.label}
                    </span>
                  </label>
                ))}
              </div>

              {disabledFeatures.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    {disabledFeatures.length} feature(s) will be disabled:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {disabledFeatures.map((featureId) => {
                      const feature = availableFeatures.find(
                        (f) => f.id === featureId
                      );
                      return (
                        <span
                          key={featureId}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                        >
                          {feature?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Whitelabel Configuration section removed as requested */}

            {/* Template Notice */}
            {/* Template Notice removed (was conditional on isFirstTime) */}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={
                !nameValidation.isValid ||
                nameValidation.isChecking ||
                !workspaceName.trim()
              }
            >
              Create Organization Workspace
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