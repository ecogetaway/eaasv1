import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { subscriptionService } from '../services/subscriptionService.js';
import {
  Check,
  X,
  CloudLightning,
  Zap,
  Grid3x3,
  Battery,
  Sun,
  Calculator,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

// ─── Master pricing data ────────────────────────────────────────────────────

const SOLAR_PLANS = [
  {
    id: 'basic',
    name: 'Solar Starter',
    monthlyFee: 1799,
    annualFee: 1619,
    energyRate: 4.50,
    hardware: '3kW Solar Panel Array',
    hardwareShort: '3kW solar',
    icon: Sun,
    recommended: false,
    features: [
      'Zero upfront hardware cost',
      '3kW solar panel array',
      'Basic monitoring dashboard',
      'Grid net-metering integration',
      'Fault repair within 48 hours',
      'Grid electricity included (DISCOM rate)',
    ],
    comparison: {
      battery: null,
      outageBackup: false,
      evCharger: false,
      smartLoad: false,
      monitoring: 'Basic',
      support: '48h fix',
      carbonCert: false,
    },
  },
  {
    id: 'pro',
    name: 'Hybrid Freedom',
    monthlyFee: 2499,
    annualFee: 2249,
    energyRate: 4.00,
    hardware: '5kW Solar + 5kWh Battery',
    hardwareShort: '5kW solar + 5kWh battery',
    icon: Zap,
    recommended: true,
    features: [
      'All Solar Starter features',
      '5kW solar + 5kWh battery system',
      'Power outage backup (4 hours)',
      'Smart load management',
      'EV charger integration ready',
      'Priority support (24h fix)',
      'Grid electricity included (DISCOM rate)',
    ],
    comparison: {
      battery: '5kWh',
      outageBackup: true,
      evCharger: true,
      smartLoad: true,
      monitoring: 'Advanced',
      support: '24h fix',
      carbonCert: false,
    },
  },
  {
    id: 'max',
    name: 'Grid Independent',
    monthlyFee: 3799,
    annualFee: 3419,
    energyRate: 3.50,
    hardware: '10kW Solar + 13.5kWh Battery',
    hardwareShort: '10kW solar + 13.5kWh battery',
    icon: Battery,
    recommended: false,
    features: [
      'Complete energy autonomy capability',
      '10kW solar + 13.5kWh battery system',
      'Whole-home backup power',
      'Advanced analytics dashboard',
      'Proactive maintenance AI',
      'Carbon offset certificates',
      'Grid electricity included (DISCOM rate)',
    ],
    comparison: {
      battery: '13.5kWh',
      outageBackup: true,
      evCharger: true,
      smartLoad: true,
      monitoring: 'AI-Powered',
      support: 'Proactive AI',
      carbonCert: true,
    },
  },
];

const INDIAN_CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Hyderabad', 'Chennai', 'Delhi'];

const GRID_RATE = 7.50; // ₹/kWh -- used for savings calculation
const DISCOM_DISPLAY_RATE = 7; // ₹/kWh -- displayed as DISCOM billing rate

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

const calcSavings = (currentBill, plan) => {
  const userKWh = currentBill / GRID_RATE;
  const newBill = userKWh * plan.energyRate + plan.monthlyFee;
  return Math.round(currentBill - newBill);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const BoolCell = ({ value }) =>
  value ? (
    <Check className="w-5 h-5 text-green-600 mx-auto" />
  ) : (
    <X className="w-5 h-5 text-gray-300 mx-auto" />
  );

// ─── 3-Step Subscribe Modal ───────────────────────────────────────────────────

const SubscribeModal = ({ plan, billingCycle, onClose }) => {
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    consumerNumber: '',
  });

  if (!plan) return null;

  const displayFee = billingCycle === 'annual' ? plan.annualFee : plan.monthlyFee;
  const billingLabel = billingCycle === 'annual' ? '/mo · billed annually' : '/month';

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.address.trim()) errors.address = 'Address is required';
    if (!form.city) errors.city = 'Please select a city';
    if (!form.consumerNumber.trim()) errors.consumerNumber = 'Consumer number is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Step indicator */}
        <div className="flex items-center border-b border-gray-100 px-6 py-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s < step
                    ? 'bg-green-500 text-white'
                    : s === step
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-16 sm:w-24 mx-1 transition-colors ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
          <div className="ml-auto">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* ── Step 1: Confirm Plan ── */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm Your Plan</h2>
              <p className="text-sm text-gray-500 mb-6">Review details before proceeding</p>

              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-5 h-5 text-brand-600" />
                  <span className="font-bold text-gray-900 text-lg">{plan.name}</span>
                  {plan.recommended && (
                    <span className="ml-auto text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{fmt(displayFee)}</span>
                  <span className="text-gray-500 text-sm">{billingLabel}</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-xs text-gray-400 line-through mb-1">
                    {fmt(plan.monthlyFee)}/month (save 10%)
                  </p>
                )}
                <p className="text-sm text-brand-700 font-medium mt-2">{plan.hardware}</p>
              </div>

              {/* ₹0 upfront banner */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      ₹0 Upfront · No Hardware Purchase Required
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Your equipment is owned and maintained by us throughout your
                      subscription. You only pay the monthly service fee.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Grid backup billed separately at ₹{DISCOM_DISPLAY_RATE}/kWh (DISCOM rate).
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Your Details ── */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Details</h2>
              <p className="text-sm text-gray-500 mb-6">
                We need a few details to schedule your site survey.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      formErrors.name ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Installation Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    placeholder="Flat/House No., Street, Area, Pincode"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                      formErrors.address ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white ${
                      formErrors.city ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your city</option>
                    {INDIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {formErrors.city && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DISCOM Consumer Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.consumerNumber}
                    onChange={(e) => handleFormChange('consumerNumber', e.target.value)}
                    placeholder="e.g. CON123456789"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      formErrors.consumerNumber ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Found on your electricity bill (e.g. CON123456789)
                  </p>
                  {formErrors.consumerNumber && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.consumerNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Subscription Confirmed!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Your order has been received. Our team will contact you within 24 hours
                to schedule a site survey.
              </p>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Order Number</span>
                  <span className="text-sm font-bold text-gray-900 font-mono">
                    ORD-2024-00847
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Hardware</span>
                  <span className="text-sm font-medium text-gray-900">{plan.hardwareShort}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Monthly Fee</span>
                  <span className="text-sm font-bold text-brand-700">
                    {fmt(displayFee)}{billingLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Upfront Cost</span>
                  <span className="text-sm font-bold text-green-600">₹0</span>
                </div>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50 p-3 mb-6 flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800">
                  ₹0 upfront · Equipment owned &amp; maintained by us · Cancel anytime
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Comparison Table ─────────────────────────────────────────────────────────

const ComparisonTable = ({ billingCycle }) => {
  const rows = [
    {
      label: 'Monthly subscription',
      type: 'price',
      key: (p) => fmt(billingCycle === 'annual' ? p.annualFee : p.monthlyFee),
    },
    {
      label: billingCycle === 'annual' ? 'Billed annually (save 10%)' : 'Billed monthly',
      type: 'subtext',
      key: (p) =>
        billingCycle === 'annual'
          ? `Was ${fmt(p.monthlyFee)}/mo`
          : 'No annual commitment',
    },
    {
      label: 'Energy rate',
      type: 'text',
      key: (p) => `₹${p.energyRate.toFixed(2)}/kWh`,
    },
    { label: 'Solar capacity', type: 'text', key: (p) => p.hardware.split('+')[0].trim() },
    {
      label: 'Battery storage',
      type: 'mixed',
      key: (p) => p.comparison.battery || null,
    },
    { label: 'Upfront cost', type: 'highlight', key: () => '₹0' },
    {
      label: 'Power outage backup',
      type: 'bool',
      key: (p) => p.comparison.outageBackup,
    },
    { label: 'EV charger ready', type: 'bool', key: (p) => p.comparison.evCharger },
    {
      label: 'Smart load management',
      type: 'bool',
      key: (p) => p.comparison.smartLoad,
    },
    {
      label: 'Monitoring dashboard',
      type: 'text',
      key: (p) => p.comparison.monitoring,
    },
    {
      label: 'Maintenance & repairs',
      type: 'text',
      key: () => 'Included',
    },
    { label: 'Net-metering integration', type: 'bool', key: () => true },
    { label: 'Support SLA', type: 'text', key: (p) => p.comparison.support },
    {
      label: 'Carbon offset certificates',
      type: 'bool',
      key: (p) => p.comparison.carbonCert,
    },
    {
      label: 'Grid electricity (DISCOM)',
      type: 'text',
      key: () => '₹7/kWh (billed separately)',
    },
  ];

  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Plan Comparison</h2>
        <p className="text-sm text-gray-500 mt-1">
          All plans include ₹0 upfront · Equipment owned &amp; maintained by us
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50 w-48 sticky left-0 z-10">
                Feature
              </th>
              {SOLAR_PLANS.map((plan) => (
                <th
                  key={plan.id}
                  className={`px-6 py-4 text-center text-sm font-bold ${
                    plan.recommended
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-900 bg-gray-50'
                  }`}
                >
                  {plan.name}
                  {plan.recommended && (
                    <span className="ml-2 text-xs bg-brand-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-3.5 text-sm text-gray-600 font-medium sticky left-0 bg-inherit z-10">
                  {row.label}
                </td>
                {SOLAR_PLANS.map((plan) => {
                  const val = row.key(plan);
                  return (
                    <td
                      key={plan.id}
                      className={`px-6 py-3.5 text-center text-sm ${
                        plan.recommended ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      {row.type === 'bool' && <BoolCell value={val} />}
                      {row.type === 'mixed' &&
                        (val ? (
                          <span className="text-gray-800 font-medium">{val}</span>
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ))}
                      {row.type === 'price' && (
                        <span className="font-bold text-gray-900 text-base">{val}</span>
                      )}
                      {row.type === 'subtext' && (
                        <span className="text-xs text-gray-400">{val}</span>
                      )}
                      {row.type === 'highlight' && (
                        <span className="font-bold text-green-600">{val}</span>
                      )}
                      {row.type === 'text' && (
                        <span className="text-gray-700">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const ServicesPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [modalPlan, setModalPlan] = useState(null);

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    loadCurrentSubscription();
  }, [user]);

  const loadCurrentSubscription = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      setError('');
      const subscriptions = await subscriptionService.getUserSubscriptions(user.userId);
      if (subscriptions && subscriptions.length > 0) {
        const planType =
          subscriptions[0].plan_type || subscriptions[0].plan_name?.toLowerCase();
        if (planType?.includes('starter') || planType?.includes('basic')) {
          setCurrentPlanId('basic');
        } else if (
          planType?.includes('hybrid') ||
          planType?.includes('pro') ||
          planType?.includes('solar_battery')
        ) {
          setCurrentPlanId('pro');
        } else if (
          planType?.includes('independent') ||
          planType?.includes('max') ||
          planType?.includes('premium')
        ) {
          setCurrentPlanId('max');
        } else {
          setCurrentPlanId('pro');
        }
      }
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError('Failed to load subscription information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan) => {
    if (plan.id === currentPlanId) return;
    setModalPlan(plan);
  };

  const handleBillInput = (e) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
    setMonthlyBill(isNaN(val) ? 0 : val);
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

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Energy Freedom
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Stop paying for unpredictable utility bills. Subscribe to a plan that gives
              you hardware, maintenance, and software in one monthly fee.
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError('')} />
            </div>
          )}

          {/* ── Savings Calculator ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-gray-900">
                Savings Calculator
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Your current monthly electricity bill
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyBill || ''}
                    onChange={handleBillInput}
                    placeholder="3000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {SOLAR_PLANS.map((plan) => {
                  const savings = calcSavings(monthlyBill, plan);
                  return (
                    <div
                      key={plan.id}
                      className={`rounded-xl p-3 text-center border ${
                        savings > 0
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-500 mb-1 leading-tight">
                        {plan.name}
                      </p>
                      {savings > 0 ? (
                        <p className="text-sm font-bold text-green-700">
                          Save {fmt(savings)}/mo
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 leading-tight">
                          Bill too low for savings
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Based on current DISCOM rate of ₹7.50/kWh. Actual savings vary by
              consumption pattern and location.
            </p>
          </div>

          {/* ── Billing Toggle ── */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 ${
                  billingCycle === 'annual'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Annual</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    billingCycle === 'annual'
                      ? 'bg-white/20 text-white'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  Save 10%
                </span>
              </button>
            </div>
          </div>

          {/* ── Plan Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Grid Electricity card */}
            <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Grid3x3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Grid Electricity</h3>
              </div>
              <div className="mb-1">
                <span className="text-2xl font-bold text-blue-600">Included</span>
              </div>
              <p className="text-sm font-semibold text-blue-700 mb-0.5">
                ₹{DISCOM_DISPLAY_RATE}/kWh
              </p>
              <p className="text-xs text-blue-600 mb-3">Variable — billed separately</p>
              <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 mb-4">
                Traditional Utility Grid
              </span>
              <div className="text-xs text-blue-800 bg-blue-50 rounded-lg border border-blue-100 p-3 mb-6">
                <p className="font-medium mb-1">Example:</p>
                <p>200 kWh/month ≈ ₹1,400 (plus fixed charges, total ₹1,500–2,000/month)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Essential grid connection for all plans',
                  'Night-time and cloudy-day supply',
                  'Net-metering revenue/credit system',
                  'Export surplus solar kWh back to grid',
                  'Seamless integration with solar plans',
                  'Reliable backup when solar + battery insufficient',
                ].map((f, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-600 text-xs">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="w-full py-2.5 px-4 rounded-lg font-medium bg-blue-100 text-blue-700 text-center text-sm">
                Always Active
              </div>
            </div>

            {/* Solar plan cards */}
            {SOLAR_PLANS.map((plan) => {
              const isSelected = currentPlanId === plan.id;
              const displayFee =
                billingCycle === 'annual' ? plan.annualFee : plan.monthlyFee;
              const savings = calcSavings(monthlyBill, plan);
              const PlanIcon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border transition-all duration-200 bg-white ${
                    isSelected
                      ? 'ring-2 ring-brand-500 shadow-xl scale-[1.02] z-10 border-brand-300'
                      : plan.recommended
                      ? 'border-brand-300 shadow-lg hover:shadow-xl'
                      : 'border-gray-200 hover:shadow-lg hover:border-brand-200'
                  }`}
                >
                  {plan.recommended && !isSelected && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                      Most Popular
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Current Plan</span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan header */}
                    <div className="flex items-center space-x-2 mb-3">
                      <PlanIcon className="w-5 h-5 text-brand-600" />
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    </div>

                    {/* Pricing */}
                    <div className="mb-1">
                      {billingCycle === 'annual' && (
                        <p className="text-sm text-gray-400 line-through">
                          {fmt(plan.monthlyFee)}/mo
                        </p>
                      )}
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold text-gray-900">
                          {fmt(displayFee)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {billingCycle === 'annual' ? '/mo · billed annually' : '/month'}
                        </span>
                      </div>
                    </div>

                    {/* Hardware badge */}
                    <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-brand-50 text-brand-700 mb-4">
                      {plan.hardware}
                    </span>

                    {/* ₹0 upfront banner */}
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 mb-4">
                      <p className="text-xs font-semibold text-green-800 leading-snug">
                        ₹0 upfront · Zero hardware cost · Equipment owned and maintained by us
                      </p>
                    </div>

                    {/* Savings indicator */}
                    {monthlyBill > 0 && (
                      <div
                        className={`rounded-lg px-3 py-2 mb-4 ${
                          savings > 0
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {savings > 0 ? (
                          <p className="text-xs font-bold text-emerald-700">
                            Estimated savings: {fmt(savings)}/mo
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">
                            Your bill is too low for direct savings with this plan
                          </p>
                        )}
                      </div>
                    )}

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-4 h-4 text-brand-500 shrink-0 mr-2 mt-0.5" />
                          <span className="text-gray-600 text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isSelected}
                      aria-label={isSelected ? 'Active plan' : `Subscribe to ${plan.name}`}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                        isSelected
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20'
                      }`}
                    >
                      {isSelected ? 'Active Plan' : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Grid Electricity info box ── */}
          <div className="mt-10 bg-blue-50 rounded-xl border border-blue-200 p-6 mb-4">
            <div className="flex items-start space-x-3">
              <Grid3x3 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-2">
                  About Grid Electricity
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  Grid electricity is{' '}
                  <strong>required and included</strong> with all solar plans. It
                  provides essential backup power during night-time and cloudy days
                  when solar + battery are insufficient. The grid connection also
                  enables <strong>net-metering</strong>, letting you export surplus
                  solar energy and earn credits.
                </p>
                <p className="text-xs text-blue-700 italic mt-2 pt-2 border-t border-blue-200">
                  <strong>Note:</strong> Grid backup is billed separately at ₹
                  {DISCOM_DISPLAY_RATE}/kWh (DISCOM rate). Rates may vary by state
                  and DISCOM provider.
                </p>
              </div>
            </div>
          </div>

          {/* ── Comparison Table ── */}
          <ComparisonTable billingCycle={billingCycle} />

          {/* ── Enterprise CTA ── */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="bg-blue-50 p-4 rounded-full">
                <CloudLightning className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Need a custom enterprise solution?
                </h4>
                <p className="text-gray-500">
                  We offer bespoke microgrid setups for housing societies and
                  industrial parks.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/support')}
              className="text-blue-600 font-bold hover:text-blue-700 border border-blue-200 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </main>

      {/* ── Subscribe Modal ── */}
      {modalPlan && (
        <SubscribeModal
          plan={modalPlan}
          billingCycle={billingCycle}
          onClose={() => setModalPlan(null)}
        />
      )}
    </div>
  );
};

export default ServicesPlans;
