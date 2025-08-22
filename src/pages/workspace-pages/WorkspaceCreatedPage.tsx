import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/Button";
import { CheckCircle, Rocket, Users, Settings, Plus } from "lucide-react";

export function WorkspaceCreatedPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const handleGoToWorkspace = () => {
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Workspace Created Successfully!
            </h1>

            <p className="text-lg text-gray-600">
              Welcome to{" "}
              <span className="font-semibold text-blue-600">
                {state.currentWorkspace?.name || "your workspace"}
              </span>
            </p>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-sm text-gray-600">
                Begin creating projects and organizing your work
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Invite Team</h3>
              <p className="text-sm text-gray-600">
                Add team members and start collaborating
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customize</h3>
              <p className="text-sm text-gray-600">
                Configure settings to match your workflow
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button onClick={handleGoToWorkspace} className="w-full" size="lg">
              Go to Workspace
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">or</p>
              <button
                onClick={() => navigate("/workspace-details")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Another Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
