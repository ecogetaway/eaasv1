import { useState, useEffect } from 'react';
import { X, Shield, Lock } from 'lucide-react';
import PaymentMethods from './PaymentMethods.jsx';
import UPIPayment from './UPIPayment.jsx';
import CardPayment from './CardPayment.jsx';
import NetBankingPayment from './NetBankingPayment.jsx';
import WalletPayment from './WalletPayment.jsx';
import PaymentSuccess from './PaymentSuccess.jsx';
import PaymentProcessing from './PaymentProcessing.jsx';

const RazorpayMock = ({ 
  isOpen, 
  onClose, 
  amount, 
  description, 
  onSuccess, 
  onFailure,
  merchantName = 'EaaS Energy Services',
  transactionId
}) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [paymentStage, setPaymentStage] = useState('select'); // select, processing, otp, success, failed
  const [processingMessage, setProcessingMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentStage('select');
      setSelectedMethod('upi');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePaymentInitiate = async (method, details) => {
    setPaymentStage('processing');
    setProcessingMessage('Initiating payment...');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (method === 'card') {
      // Card payments need OTP verification
      setPaymentStage('otp');
    } else {
      // UPI, Net Banking, Wallets - simulate waiting
      setProcessingMessage(
        method === 'upi' 
          ? 'Waiting for payment confirmation from your UPI app...'
          : method === 'netbanking'
          ? 'Redirecting to your bank...'
          : 'Processing wallet payment...'
      );
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPaymentStage('success');
      
      setTimeout(() => {
        onSuccess?.({
          paymentId: `pay_${Date.now()}`,
          method,
          amount,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    }
  };

  const handleOTPVerify = async (otp) => {
    setPaymentStage('processing');
    setProcessingMessage('Verifying OTP...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStage('success');
    
    setTimeout(() => {
      onSuccess?.({
        paymentId: `pay_${Date.now()}`,
        method: 'card',
        amount,
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  const handleClose = () => {
    if (paymentStage === 'processing') return; // Don't allow close during processing
    onClose?.();
  };

  const renderContent = () => {
    switch (paymentStage) {
      case 'processing':
        return <PaymentProcessing message={processingMessage} />;
      
      case 'otp':
        return (
          <OTPVerification 
            onVerify={handleOTPVerify} 
            onCancel={() => setPaymentStage('select')} 
          />
        );
      
      case 'success':
        return <PaymentSuccess amount={amount} paymentId={transactionId} />;
      
      case 'failed':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
            <button 
              onClick={() => setPaymentStage('select')}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        );
      
      default:
        return (
          <>
            <PaymentMethods 
              selectedMethod={selectedMethod} 
              onSelect={setSelectedMethod} 
            />
            
            <div className="mt-4">
              {selectedMethod === 'upi' && (
                <UPIPayment amount={amount} onPay={(details) => handlePaymentInitiate('upi', details)} />
              )}
              {selectedMethod === 'card' && (
                <CardPayment onPay={(details) => handlePaymentInitiate('card', details)} />
              )}
              {selectedMethod === 'netbanking' && (
                <NetBankingPayment onPay={(details) => handlePaymentInitiate('netbanking', details)} />
              )}
              {selectedMethod === 'wallet' && (
                <WalletPayment onPay={(details) => handlePaymentInitiate('wallet', details)} />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all">
          {/* Razorpay-style Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">R</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{merchantName}</p>
                  <p className="text-blue-100 text-xs">{description || 'Payment'}</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="text-white hover:text-blue-200 transition-colors"
                disabled={paymentStage === 'processing'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Amount Display */}
            <div className="mt-4 text-center">
              <p className="text-blue-100 text-sm">Amount</p>
              <p className="text-white text-3xl font-bold">₹{amount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 rounded-b-xl px-6 py-3 border-t">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                <span>Encrypted Payment</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Powered by <span className="font-semibold text-blue-600">Razorpay</span> (Demo Mode)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// OTP Verification Component
const OTPVerification = ({ onVerify, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    onVerify(otpValue);
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter OTP</h3>
      <p className="text-gray-600 text-sm mb-6">
        We've sent a 6-digit OTP to your registered mobile number
      </p>
      
      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <div className="text-sm text-gray-500 mb-6">
        {resendTimer > 0 ? (
          <span>Resend OTP in {resendTimer}s</span>
        ) : (
          <button className="text-blue-600 hover:underline">Resend OTP</button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={onCancel}
          className="flex-1 btn btn-secondary"
        >
          Cancel
        </button>
        <button 
          onClick={handleVerify}
          className="flex-1 btn btn-primary"
        >
          Verify & Pay
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        Demo: Enter any 6 digits to proceed
      </p>
    </div>
  );
};

export default RazorpayMock;

