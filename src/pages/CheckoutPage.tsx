import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, CreditCard } from 'lucide-react';

export function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useAppContext();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      // Check if user is first time - if returning user, skip workspace creation
      if (state.user && !state.user.isFirstTime) {
        navigate('/workspace');
      } else {
        navigate('/workspace-details');
      }
    }, 2500);
  };

  return (
    <PageLayout
      title="Complete Your Purchase"
      subtitle="Secure payment processing with 256-bit SSL encryption"
      showBackButton
      onBack={() => navigate('/payment')}
    >
      <div className="space-y-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Pro Plan (Monthly)</span>
              <span className="font-medium">$29.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Setup Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>$29.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Information</span>
            </h3>
            
            <Input
              label="Name on Card"
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder="John Doe"
              required
            />
            
            <Input
              label="Card Number"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
              
              <Input
                label="CVV"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full"
            loading={loading}
            size="lg"
          >
            Confirm Payment
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}