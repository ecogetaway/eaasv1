import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { subscriptionService } from '../services/subscriptionService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { Package, Calendar, Zap, Battery, TrendingUp, X } from 'lucide-react';

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const subscriptions = await subscriptionService.getUserSubscriptions(user.userId);
      if (subscriptions && subscriptions.length > 0) {
        setSubscription(subscriptions[0]); // Get first active subscription
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    try {
      // Cancel subscription endpoint would be added to backend
      setSuccess('Subscription cancellation request submitted. Our team will contact you shortly.');
      setTimeout(() => {
        setSuccess('');
        loadSubscription();
      }, 3000);
    } catch (error) {
      setError('Failed to cancel subscription. Please try again.');
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

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="card text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Active Subscription</h2>
              <p className="text-gray-500 mb-6">You don't have an active subscription yet.</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="btn btn-primary"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const planName = subscription.plan_name || subscription.plan_type?.replace('_', ' ').toUpperCase() || 'Unknown Plan';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Subscription</h1>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Package className="w-6 h-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold">Current Plan</h2>
                  </div>
                  <span className={`badge ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{planName}</h3>
                    <p className="text-gray-600">{subscription.features && typeof subscription.features === 'string' ? subscription.features : 'Energy-as-a-Service subscription'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Zap className="w-4 h-4 mr-2" />
                        <span className="text-sm">Solar Capacity</span>
                      </div>
                      <p className="text-xl font-semibold">{subscription.installation_capacity || 0} kW</p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Battery className="w-4 h-4 mr-2" />
                        <span className="text-sm">Battery Capacity</span>
                      </div>
                      <p className="text-xl font-semibold">{subscription.battery_capacity || 0} kWh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Billing Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Fee</span>
                    <span className="font-semibold">{formatCurrency(subscription.monthly_fee || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span>{formatDate(subscription.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing Date</span>
                    <span>{formatDate(subscription.next_billing_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/billing')}
                    className="btn btn-outline w-full"
                  >
                    View Bills
                  </button>
                  {subscription.status === 'active' && (
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline w-full text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>

              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Contact our support team for subscription changes or questions.
                </p>
                <button
                  onClick={() => navigate('/support')}
                  className="btn btn-primary w-full"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;

