import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Shield, Mail } from 'lucide-react';

export function VerificationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      dispatch({ type: 'SET_VERIFICATION_COMPLETED', payload: true });
      setLoading(false);
      navigate('/checkout');
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulate resending verification code
    alert('Verification code sent to your email!');
  };

  return (
    <PageLayout
      title="Verify Your Account"
      subtitle="We've sent a verification code to your email address"
      showBackButton
      onBack={() => navigate('/payment')}
    >
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            Enter the 6-digit verification code we sent to your email to secure your account
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-2xl font-mono tracking-widest"
            required
          />
          
          <Button 
            type="submit"
            className="w-full"
            loading={loading}
            disabled={code.length !== 6}
            size="lg"
          >
            Verify Account
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Resend Code</span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}