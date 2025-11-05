import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { formatDateTime, getTimeAgo } from '../utils/formatters.js';
import { Activity, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const Meters = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    loadMeters();
  }, [user]);

  const loadMeters = async () => {
    try {
      setLoading(true);
      // Mock data for now - would fetch from backend API
      const mockMeters = [
        {
          meter_id: '1',
          device_type: 'smart_meter',
          manufacturer: 'Schneider Electric',
          model: 'ION7650',
          firmware_version: '2.1.5',
          last_sync: new Date().toISOString(),
          sync_status: 'synced',
          connection_status: 'online',
          calibration_date: '2024-01-15',
        },
      ];
      setMeters(mockMeters);
    } catch (error) {
      console.error('Error loading meters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (meterId) => {
    try {
      // Sync endpoint would be added to backend
      alert('Sync initiated. This may take a few moments.');
      setTimeout(() => {
        loadMeters();
      }, 2000);
    } catch (error) {
      alert('Failed to sync meter. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Smart Meters</h1>

          {meters.length === 0 ? (
            <div className="card text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Meters Found</h2>
              <p className="text-gray-500">No smart meters are currently registered to your account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meters.map((meter) => (
                <div key={meter.meter_id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{meter.device_type.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">{meter.manufacturer} {meter.model}</p>
                    </div>
                    <div className="flex items-center">
                      {meter.connection_status === 'online' ? (
                        <Wifi className="w-5 h-5 text-green-600" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Firmware Version</span>
                      <span className="font-medium">{meter.firmware_version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Sync</span>
                      <span className="font-medium">{getTimeAgo(meter.last_sync)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sync Status</span>
                      <span className={`font-medium ${
                        meter.sync_status === 'synced' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {meter.sync_status === 'synced' ? (
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Synced
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Pending
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Calibration Date</span>
                      <span className="font-medium">{new Date(meter.calibration_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleSync(meter.meter_id)}
                      className="btn btn-outline w-full flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Meters;

