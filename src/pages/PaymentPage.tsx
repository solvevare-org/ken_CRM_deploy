import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { CreditCard, Check } from 'lucide-react';

export function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const plans = [
    {
      name: 'All-in-One',
      price: '$80',
      period: 'per month',
      features: [
        'Unlimited Workspaces',
        'Unlimited Team Members',
        '24/7 Priority Support',
        '1TB Storage',
        'Advanced Analytics',
        'Custom Integrations'
      ]
    }
  ];

  const handleProceedToPay = () => {
    setLoading(true);
    
    setTimeout(() => {
      dispatch({ type: 'SET_PAYMENT_COMPLETED', payload: true });
      setLoading(false);
      navigate('/checkout');
    }, 2000);
  };

  return (
    <PageLayout
      title="Choose Your Plan"
      subtitle="Select the plan for your account"
      showBackButton
      onBack={() => navigate('/verification')}
    >
      <div className="space-y-8 text-black">
        <div className="grid md:grid-cols-1 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative p-6 rounded-xl border-2 border-blue-500 bg-blue-50 shadow-lg scale-105"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-black mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-black mb-1">{plan.price}</div>
                <div className="text-black">{plan.period}</div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-black">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-black" />
            <h3 className="text-lg font-semibold text-black">Payment Method</h3>
          </div>
          <p className="text-black mb-4">
            Secure payment processing with industry-standard encryption. 
            You can cancel anytime with no hidden fees.
          </p>
          <div className="flex items-center space-x-2 text-sm text-black">
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