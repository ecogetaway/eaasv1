import { useState } from 'react';
import { subscriptionService } from '../../services/subscriptionService.js';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Step3_Payment = ({ formData, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.selectedPlan) {
      alert('Please go back and select a plan');
      return;
    }

    try {
      setProcessing(true);
      
      // Create subscription
      await subscriptionService.createSubscription({
        plan_id: formData.selectedPlan,
        address: formData.address,
        monthly_bill: parseFloat(formData.monthlyBill),
      });

      // Simulate payment processing (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error creating subscription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Complete Your Subscription</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Smartphone className="w-5 h-5 mr-3 text-primary-600" />
              <span className="font-medium">UPI</span>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 mr-3 text-primary-600" />
              <span className="font-medium">Credit/Debit Card</span>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="net_banking"
                checked={paymentMethod === 'net_banking'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Building2 className="w-5 h-5 mr-3 text-primary-600" />
              <span className="font-medium">Net Banking</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                className="input"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              You will be redirected to your UPI app to complete the payment.
            </p>
          </div>
        )}

        {paymentMethod === 'net_banking' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <select className="input">
              <option>Select your bank</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
            </select>
          </div>
        )}

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-800">
            <strong>Note:</strong> This is a demo payment. No actual charges will be made.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={processing}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Processing...</span>
              </span>
            ) : (
              'Complete Subscription'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3_Payment;

