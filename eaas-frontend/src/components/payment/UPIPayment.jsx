import { useState } from 'react';
import { QrCode, Smartphone } from 'lucide-react';

const UPIPayment = ({ onPay, amount }) => {
  const [mode, setMode] = useState('apps'); // apps, qr, vpa
  const [vpa, setVpa] = useState('');
  const [error, setError] = useState('');

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500', icon: '₹' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600', icon: 'Pe' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-400', icon: 'P' },
    { id: 'bhim', name: 'BHIM', color: 'bg-green-600', icon: 'B' },
  ];

  const handleVPASubmit = () => {
    if (!vpa) {
      setError('Please enter UPI ID');
      return;
    }
    if (!vpa.includes('@')) {
      setError('Invalid UPI ID format');
      return;
    }
    onPay({ type: 'vpa', vpa });
  };

  const handleAppSelect = (appId) => {
    onPay({ type: 'app', app: appId });
  };

  return (
    <div>
      {/* Mode Selection Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setMode('apps')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'apps' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Smartphone className="w-4 h-4 inline mr-1" />
          UPI Apps
        </button>
        <button
          onClick={() => setMode('qr')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'qr' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <QrCode className="w-4 h-4 inline mr-1" />
          QR Code
        </button>
        <button
          onClick={() => setMode('vpa')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'vpa' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          UPI ID
        </button>
      </div>

      {/* UPI Apps */}
      {mode === 'apps' && (
        <div className="grid grid-cols-2 gap-3">
          {upiApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppSelect(app.id)}
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center text-white font-bold mr-3`}>
                {app.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{app.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* QR Code */}
      {mode === 'qr' && (
        <div className="text-center py-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Scan to pay{' '}
            <span className="text-green-700">
              ₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </p>
          <div className="bg-white border-4 border-gray-200 rounded-lg p-4 inline-block mb-4">
            {/* Simulated QR Code Pattern */}
            <div className="w-40 h-40 bg-gradient-to-br from-gray-900 to-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-2 bg-white rounded">
                <div className="grid grid-cols-7 gap-0.5 p-2 h-full">
                  {[1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,0,1,1,0,1,1,0,1,0,1].map((cell, i) => (
                    <div
                      key={i}
                      className={cell ? 'bg-gray-900' : 'bg-white'}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 bg-gray-900 rounded-sm">
                <div className="absolute inset-1 border-2 border-white" />
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-gray-900 rounded-sm">
                <div className="absolute inset-1 border-2 border-white" />
              </div>
              <div className="absolute bottom-2 left-2 w-8 h-8 bg-gray-900 rounded-sm">
                <div className="absolute inset-1 border-2 border-white" />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Scan with any UPI app</p>
          <p className="text-xs text-gray-400 mb-4">QR expires in 5:00 minutes</p>
          <button 
            onClick={() => onPay({ type: 'qr' })}
            className="btn btn-primary w-full"
          >
            I've Scanned the QR
          </button>
        </div>
      )}

      {/* VPA Input */}
      {mode === 'vpa' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter UPI ID
          </label>
          <input
            type="text"
            value={vpa}
            onChange={(e) => { setVpa(e.target.value); setError(''); }}
            placeholder="yourname@upi"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          
          <div className="mt-3 flex flex-wrap gap-2">
            {['@ybl', '@paytm', '@okicici', '@okhdfcbank'].map((suffix) => (
              <button
                key={suffix}
                onClick={() => setVpa(prev => prev.split('@')[0] + suffix)}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                {suffix}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleVPASubmit}
            className="mt-4 btn btn-primary w-full"
          >
            Verify & Pay
          </button>
          
          <p className="text-xs text-gray-400 mt-3 text-center">
            Demo: Enter any UPI ID format (e.g., demo@ybl)
          </p>
        </div>
      )}
    </div>
  );
};

export default UPIPayment;

