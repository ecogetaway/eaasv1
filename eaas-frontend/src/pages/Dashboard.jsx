import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { EnergyProvider } from '../context/EnergyContext.jsx';
import { useEnergy } from '../hooks/useRealTimeEnergy.js';
import { subscriptionService } from '../services/subscriptionService.js';
import Navbar from '../components/common/Navbar.jsx';
import LiveMetrics from '../components/dashboard/LiveMetrics.jsx';
import EnergyChart from '../components/dashboard/EnergyChart.jsx';
import SavingsCard from '../components/dashboard/SavingsCard.jsx';
import CarbonImpact from '../components/dashboard/CarbonImpact.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertList from '../components/alerts/AlertList.jsx';
import EnergyOverviewCards from '../components/dashboard/EnergyOverviewCards.jsx';
import EnergyMixChart from '../components/dashboard/EnergyMixChart.jsx';
import BatteryPerformanceChart from '../components/dashboard/BatteryPerformanceChart.jsx';
import GridIndependenceScore from '../components/dashboard/GridIndependenceScore.jsx';
import { formatCurrency, formatKWh } from '../utils/formatters.js';
import MetricCard from '../components/common/MetricCard.jsx';
import DiscomStatusCard from '../components/dashboard/DiscomStatusCard.jsx';
import { Sun, Zap } from 'lucide-react';

const DashboardContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('day');
  
  const { currentEnergy, energyHistory, dashboardSummary, loadHistory } = useEnergy();

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }

    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const subscriptions = await subscriptionService.getUserSubscriptions(user.userId);
      if (subscriptions.length > 0) {
        setSubscription(subscriptions[0]);
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId && period) {
      loadHistory(period);
    }
  }, [period, user?.userId]);

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

  if (!subscription) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Energy Overview Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Energy Overview</h1>
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border mt-2 sm:mt-0">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
                System Status: <span className="font-medium text-green-600">Optimal</span>
              </div>
            </div>
            <EnergyOverviewCards 
              currentEnergy={currentEnergy}
              dashboardSummary={dashboardSummary}
              subscription={subscription}
            />
          </div>

          {/* Energy Mix Analysis Chart */}
          <div className="mb-8">
            <EnergyMixChart energyHistory={energyHistory} />
          </div>

          {/* Battery Performance and Grid Independence Score */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BatteryPerformanceChart 
              energyHistory={energyHistory} 
              batteryCapacity={subscription.battery_capacity}
            />
            <GridIndependenceScore 
              dashboardSummary={dashboardSummary} 
              energyHistory={energyHistory}
            />
          </div>

          {/* Original Live Metrics (kept for compatibility) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Detailed Metrics</h2>
            <LiveMetrics
              currentEnergy={currentEnergy}
              batteryCapacity={subscription.battery_capacity}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SavingsCard dashboardSummary={dashboardSummary} />
            <CarbonImpact dashboardSummary={dashboardSummary} />
            <MetricCard
              title="Solar Generated Today"
              value={formatKWh(dashboardSummary?.today?.solar_units || 0)}
              icon={Sun}
              color="yellow"
              subtitle="Total solar energy"
            />
          </div>

          {/* Energy Chart */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Energy Analytics</h2>
              <div className="flex space-x-2">
                {['day', 'week', 'month'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      period === p
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <EnergyChart energyHistory={energyHistory} period={period} />
          </div>

          {/* DISCOM Status & Active Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">DISCOM Status</h2>
              <DiscomStatusCard userId={user?.userId} />
            </div>
            <div>
            <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
            <AlertList showOnlyActive={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user?.userId) {
    return null;
  }

  return (
    <EnergyProvider userId={user.userId}>
      <DashboardContent />
    </EnergyProvider>
  );
};

export default Dashboard;

