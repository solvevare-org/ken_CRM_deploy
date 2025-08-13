import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { User, Building2, ArrowRight } from 'lucide-react';

export function SignupOptionsPage() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleIndividualSignup = () => {
    dispatch({ type: 'SET_SIGNUP_TYPE', payload: 'individual' });
    navigate('/account-verification-options');
  };

  const handleOrganizationSignup = () => {
    dispatch({ type: 'SET_SIGNUP_TYPE', payload: 'organization' });
    navigate('/account-verification-options');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h1>
          <p className="text-lg text-gray-600">
            Select how you want to use our workspace platform
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Individual Option */}
          <div 
            onClick={handleIndividualSignup}
            className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-lg group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors duration-200">
                <User className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign up as Individual</h3>
              <p className="text-gray-600 mb-6">
                Perfect for solo professionals and personal projects
              </p>
              
              <div className="space-y-2 mb-8 text-left">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Personal workspace</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Standard organization template</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Quick setup process</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Organization Option */}
          <div 
            onClick={handleOrganizationSignup}
            className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-green-500 cursor-pointer transition-all duration-200 hover:shadow-lg group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors duration-200">
                <Building2 className="w-8 h-8 text-green-600 group-hover:text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign up as Organization</h3>
              <p className="text-gray-600 mb-6">
                Built for teams, companies, and collaborative projects
              </p>
              
              <div className="space-y-2 mb-8 text-left">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Team collaboration</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Multiple invite options</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Whitelabel configuration</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}