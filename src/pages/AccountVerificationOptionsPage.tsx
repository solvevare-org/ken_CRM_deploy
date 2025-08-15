import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSignupData, setVerificationMethod } from '../store/slices/signupSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Smartphone } from 'lucide-react';
import { BASE_URL } from '../config';

export function AccountVerificationOptionsPage() {
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userType, verificationMethod } = useAppSelector(state => state.signup);

  const resetSuccessState = () => {
    setSuccess(false);
    setError('');
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate names
    if (!firstName.trim()) {
      setError('First name is required.');
      setLoading(false);
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      setLoading(false);
      return;
    }
    // Validate password
    if (!password) {
      setError('Password is required.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    // Validate method
    if (method === 'email') {
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      
      // Store all data in Redux
      dispatch(setSignupData({
        email,
        password,
        firstName,
        lastName,
        phone: phone || '',
        verificationMethod: 'email'
      }));

      // Call signup endpoint directly
      try {
        const requestBody = {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone: 1928918912,
          user_type: userType
        };
        
        console.log('Sending signup request:', requestBody);
        
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          // Show success message before navigating
          setError('');
          setSuccess(true);
          // Small delay to show success feedback
          setTimeout(() => {
            navigate('/verification');
          }, 1000);
        } else {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          setError(errorData.message || 'Something went wrong during signup. Please try again.');
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    } else if (method === 'phone') {
      if (!phone || !/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
        setError('Please enter a valid phone number.');
        setLoading(false);
        return;
      }
      
      // Store all data in Redux
      dispatch(setSignupData({
        email: email || '',
        password,
        firstName,
        lastName,
        phone,
        verificationMethod: 'phone'
      }));

      // Call signup endpoint directly
      try {
        const requestBody = {
          email: email || null,
          password,
          first_name: firstName,
          name: lastName,
          phone: parseInt(phone) || 0,
          user_type: userType
        };
        
        console.log('Sending signup request:', requestBody);
        
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          // Show success message before navigating
          setError('');
          setSuccess(true);
          // Small delay to show success feedback
          setTimeout(() => {
            navigate('/verification');
          }, 1000);
        } else {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          setError(errorData.message || 'Something went wrong during signup. Please try again.');
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Create Your Account</h2>
        <form onSubmit={handleContinue} className="space-y-6">
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value);
              resetSuccessState();
            }}
            placeholder="Enter your first name"
            required
            className="text-black"
          />
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
              resetSuccessState();
            }}
            placeholder="Enter your last name"
            required
            className="text-black"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              resetSuccessState();
            }}
            placeholder="Create a password"
            required
            className="text-black"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              resetSuccessState();
            }}
            placeholder="Confirm your password"
            required
            className="text-black"
          />
          <h3 className="text-lg font-semibold text-black mt-4 mb-2 text-center">Choose Verification Method</h3>
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${method === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'} text-black font-medium focus:outline-none`}
              onClick={() => {
                setMethod('email');
                resetSuccessState();
              }}
            >
              <Mail className="w-5 h-5" /> Email
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${method === 'phone' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-100'} text-black font-medium focus:outline-none`}
              onClick={() => {
                setMethod('phone');
                resetSuccessState();
              }}
            >
              <Smartphone className="w-5 h-5" /> Phone Number
            </button>
          </div>
          {method === 'email' && (
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                resetSuccessState();
              }}
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
              onChange={e => {
                setPhone(e.target.value);
                resetSuccessState();
              }}
              placeholder="Enter your phone number"
              required
              className="text-black"
            />
          )}
          {success && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
              ✓ Account created successfully! Check your {verificationMethod} for verification code. Redirecting...
            </div>
          )}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={
              !method ||
              !firstName.trim() ||
              !lastName.trim() ||
              !password ||
              !confirmPassword ||
              (method === 'email' && !email) ||
              (method === 'phone' && !phone) ||
              loading
            }
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
