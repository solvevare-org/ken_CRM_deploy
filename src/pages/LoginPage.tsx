import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Sparkles, Zap } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      const user = {
        id: '1',
        email,
        name: 'Alex Johnson',
        type: 'individual' as const,
        isFirstTime: false, // Returning user
        role: 'admin' as const,
        phone: '+1 (555) 123-4567',
        license: 'RE123456789',
        brokerage: 'Premium Realty Group'
      };
      
      dispatch({ type: 'SET_USER', payload: user });
      setLoading(false);
      navigate('/payment');
    }, 2000);
  };

  const handleSignup = () => {
    navigate('/signup-options');
  };

  return (
    <PageLayout
      title="Welcome Back"
      subtitle="Sign in to your premium workspace and unlock unlimited possibilities"
    >
      <div className="space-y-8">
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
              <input type="checkbox" className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/30" />
              <span className="text-white/80">Remember me</span>
            </label>
            <button type="button" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
              Forgot password?
            </button>
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            magnetic
            glow
          >
            <Zap size={20} />
            Sign In
          </Button>
        </form>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/60 font-medium">or continue with</span>
          </div>
        </div>
        
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="glass" className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </Button>
          <Button variant="glass" className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </Button>
        </div>
        
        {/* Signup Link */}
        <div className="text-center">
          <p className="text-white/70 mb-4">Don't have an account?</p>
          <Button
            variant="holographic"
            size="lg"
            onClick={handleSignup}
            className="flex items-center space-x-2 mx-auto"
            magnetic
          >
            <Sparkles size={20} />
            <span>Create Your Workspace</span>
          </Button>
        </div>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white">Lightning Fast</h3>
            <p className="text-sm text-white/60">Blazing fast performance</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white">AI Powered</h3>
            <p className="text-sm text-white/60">Smart automation</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white">Ultra Secure</h3>
            <p className="text-sm text-white/60">Bank-grade security</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}