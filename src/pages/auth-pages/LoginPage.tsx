import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Sparkles, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";
import { CRM_BASE_DOMAIN } from "@/config";
import { setEmail } from "@/store/slices/otherAuthSlice";

export function LoginPage() {
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string | null
  const authError = useAppSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [authError]);

  const handleWorkspaceClick = (workspace: any) => {
    const slug = workspace.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const protocol = window.location.protocol;
    const host = `${slug}.${CRM_BASE_DOMAIN}`;
    const port = window.location.port ? `:${window.location.port}` : "";
    const targetUrl = `${protocol}//${host}${port}/client`;
    window.location.assign(targetUrl);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      console.log(result);

      if (result.data?.type === "Unverified Login") {
        dispatch(setEmail(email));
        navigate("/verification");
        return;
      }

      const user = result.data;
      dispatch({ type: "SET_USER", payload: user });

      if (result.data?.user_type === "Realtor") {
        navigate("/workspace");
      } else if (result.data?.user_type === "Client") {
        handleWorkspaceClick(result.data?.workspace);
      } else {
        navigate("/workspace");
      }
    } catch (_err: any) {
      // Explicitly type _err as any for flexibility, or use a more specific type if known
      let errorMessage = "An unknown error occurred.";
      if (typeof _err === "string") {
        errorMessage = _err;
      } else if (_err && typeof _err === "object" && "message" in _err) {
        errorMessage = _err.message as string; // Type assertion to ensure message is string
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    dispatch(clearError());
    navigate("/signup-options");
  };

  return (
    <PageLayout
      title="Welcome Back"
      subtitle="Sign in to your premium workspace and unlock unlimited possibilities"
    >
      <div className="space-y-8 text-black">
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmailLocal(e.target.value)}
            icon={<Mail size={20} />}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={20} />}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-black/30 bg-black/10 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-black/80">Remember me</span>
            </label>
            <button
              type="button"
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          {error && (
            <div className="text-red-600 border-red-300 border p-2 bg-red-50 text-sm font-medium text-center mb-2">
              {error}
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            <Zap size={20} />
            Login
          </Button>
        </form>
        <div className="flex items-center justify-center mt-6">
          <span className="text-black mr-2">Don't have an account?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignup}
            className="ml-2"
          >
            Sign Up
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-black/10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black">Lightning Fast</h3>
            <p className="text-sm text-black/60">Blazing fast performance</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black">AI Powered</h3>
            <p className="text-sm text-black/60">Smart automation</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black">Ultra Secure</h3>
            <p className="text-sm text-black/60">Bank-grade security</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
