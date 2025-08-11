import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { CreditCard, Check } from 'lucide-react';

export function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const plans = [
    {
      name: 'Basic',
      price: '$9',
      period: 'per month',
      features: ['5 Workspaces', '10 Team Members', 'Basic Support', '10GB Storage']
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: ['Unlimited Workspaces', '50 Team Members', 'Priority Support', '100GB Storage', 'Advanced Analytics'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: ['Everything in Pro', 'Unlimited Team Members', '24/7 Support', '1TB Storage', 'Custom Integrations']
    }
  ];

  const handleProceedToPay = () => {
    setLoading(true);
    
    setTimeout(() => {
      dispatch({ type: 'SET_PAYMENT_COMPLETED', payload: true });
      setLoading(false);
      navigate('/verification');
    }, 2000);
  };

  return (
    <PageLayout
      title="Choose Your Plan"
      subtitle="Select the plan that best fits your needs"
      showBackButton
      onBack={() => navigate(-1)}
    >
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                plan.popular 
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                <div className="text-gray-600">{plan.period}</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Secure payment processing with industry-standard encryption. 
            You can cancel anytime with no hidden fees.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>💳 Credit Card</span>
            <span>•</span>
            <span>🏦 Bank Transfer</span>
            <span>•</span>
            <span>📱 Digital Wallets</span>
          </div>
        </div>
        
        <Button 
          onClick={handleProceedToPay}
          className="w-full"
          loading={loading}
          size="lg"
        >
          Proceed to Pay
        </Button>
      </div>
    </PageLayout>
  );
}