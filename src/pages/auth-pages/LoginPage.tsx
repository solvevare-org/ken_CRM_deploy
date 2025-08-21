import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { BASE_URL } from "@/config";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Sparkles, Zap } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status !== 200) {
        setError("Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }
      const user = await response.json();
      localStorage.setItem("token", user.data?.token);
      dispatch({ type: "SET_USER", payload: user });
      setLoading(false);

      // Route based on user_type
      if (user.data?.user_type === "Realtor") {
        navigate("/workspace");
      } else if (user.data?.user_type === "Client") {
        navigate("/client");
      } else {
        // Default fallback
        navigate("/workspace");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signup-options");
  };

  return (
    <PageLayout
      title="Welcome Back"
      subtitle="Sign in to your premium workspace and unlock unlimited possibilities"
    >
      <div className="space-y-8 text-black">
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <div className="text-red-600 text-sm font-medium text-center mb-2">
              {error}
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            // magnetic
            // glow
          >
            <Zap size={20} />
            Login
          </Button>
        </form>
        {/* Signup Link */}
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
        {/* Features Preview */}
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
