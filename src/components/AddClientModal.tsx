import React, { useState } from "react";
import { X, Link2, Copy, Check } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onInviteSuccess,
}) => {
  const [inviteLink, setInviteLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "https://crm.vire-s.com/api/"
        }/api/clients/invite-link`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate invite link");
      }

      const result = await response.json();
      setInviteLink(result.inviteLink);
      // Notify parent that an invite link has been created so it can refresh state
      try {
        onInviteSuccess();
      } catch (e) {
        // parent may not depend on this; ignore
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate invite link"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleClose = () => {
    setInviteLink("");
    setError("");
    setLinkCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Client</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Shareable Link Section (generate-only) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Shareable Link
              </h3>
            </div>

            {!inviteLink ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Generate a shareable link that you can send to clients
                  directly
                </p>
                <button
                  onClick={handleGenerateLink}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Generate Link"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Share this link with your clients:
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
