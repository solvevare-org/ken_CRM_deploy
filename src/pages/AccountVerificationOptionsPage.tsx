import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Smartphone } from 'lucide-react';

export function AccountVerificationOptionsPage() {
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (method === 'email') {
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      // Simulate sending OTP to email
      navigate('/verification', { state: { method: 'email', value: email } });
    } else if (method === 'phone') {
      if (!phone || !/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
        setError('Please enter a valid phone number.');
        return;
      }
      // Simulate sending OTP to phone
      navigate('/verification', { state: { method: 'phone', value: phone } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Choose Verification Method</h2>
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${method === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'} text-black font-medium focus:outline-none`}
            onClick={() => setMethod('email')}
          >
            <Mail className="w-5 h-5" /> Email
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${method === 'phone' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-100'} text-black font-medium focus:outline-none`}
            onClick={() => setMethod('phone')}
          >
            <Smartphone className="w-5 h-5" /> Phone Number
          </button>
        </div>
        <form onSubmit={handleContinue} className="space-y-6">
          {method === 'email' && (
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="text-black"
            />
          )}
          {method === 'phone' && (
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="text-black"
            />
          )}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!method || (method === 'email' && !email) || (method === 'phone' && !phone)}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
