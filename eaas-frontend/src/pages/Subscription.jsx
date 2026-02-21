import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import SuccessMessage from '../components/common/SuccessMessage.jsx';
import {
  Package,
  Calendar,
  Zap,
  Battery,
  TrendingUp,
  X,
  ArrowUpCircle,
  PauseCircle,
  CheckCircle,
  FileText,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// Master EaaS subscription data — Hybrid Freedom plan
const MOCK_SUBSCRIPTION = {
  plan_name: 'Hybrid Freedom',
  monthly_fee: 2499,
  solar_capacity: 5,
  battery_capacity: 5,
  status: 'active',
  start_date: '15 Oct 2024',
  next_billing_date: '15 Mar 2025',
  usage_kwh: 142,
  cycle_limit_kwh: 300,
  energy_rate: 4.0,
  meter_number: 'MTR87654321',
};

const GRID_INDEPENDENT_PLAN = {
  plan_name: 'Grid Independent',
  monthly_fee: 3799,
  solar_capacity: 10,
  battery_capacity: 13.5,
  energy_rate: 3.5,
};

const CANCEL_REASONS = [
  'Moving to a new home',
  'Switching to another provider',
  'Financial reasons',
  'Equipment issues',
  'Other',
];

const HISTORY_TIMELINE = [
  {
    id: 1,
    icon: CheckCircle,
    label: 'Plan Activated',
    date: '15 Oct 2024',
    color: 'text-green-600',
    bg: 'bg-green-100',
    dot: 'bg-green-500',
  },
  {
    id: 2,
    icon: FileText,
    label: 'First Bill Generated',
    date: '01 Nov 2024',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    dot: 'bg-blue-500',
  },
  {
    id: 3,
    icon: Zap,
    label: '100 kWh Milestone Reached',
    date: '10 Nov 2024',
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    dot: 'bg-amber-500',
  },
];

// ─── Upgrade Plan Modal ───────────────────────────────────────────────────────
const UpgradePlanModal = ({ onClose, onSuccess }) => {
  const [requesting, setRequesting] = useState(false);

  const handleRequestUpgrade = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      onSuccess('Upgrade request submitted! Our team will contact you within 24 hours to schedule the installation.');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade Plan"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Upgrade Your Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            You are currently on <span className="font-semibold text-gray-800">Hybrid Freedom</span>. Upgrade to go completely grid-independent.
          </p>

          {/* Grid Independent Plan Card */}
          <div className="border-2 border-green-500 rounded-xl p-4 bg-green-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
                Recommended Upgrade
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-2">{GRID_INDEPENDENT_PLAN.plan_name}</h3>
            <p className="text-2xl font-bold text-green-700 mt-1">
              ₹{GRID_INDEPENDENT_PLAN.monthly_fee.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/mo</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500">Solar</p>
                  <p className="text-sm font-semibold">{GRID_INDEPENDENT_PLAN.solar_capacity} kW</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Battery</p>
                  <p className="text-sm font-semibold">{GRID_INDEPENDENT_PLAN.battery_capacity} kWh</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-green-200">
              <p className="text-xs text-green-800 font-medium">
                ₹0 upfront · Zero hardware cost · Equipment owned and maintained by us
              </p>
            </div>

            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Energy rate: ₹{GRID_INDEPENDENT_PLAN.energy_rate}/kWh · Grid backup billed at ₹7/kWh
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">What happens next?</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Our team contacts you within 24 hours</li>
              <li>Hardware upgrade scheduled at no cost to you</li>
              <li>New billing starts from next cycle</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={handleRequestUpgrade}
            disabled={requesting}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {requesting ? 'Submitting…' : 'Request Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Pause Subscription Modal ─────────────────────────────────────────────────
const PauseSubscriptionModal = ({ onClose, onSuccess }) => {
  const [duration, setDuration] = useState('1');
  const [confirming, setConfirming] = useState(false);

  const handleConfirmPause = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onSuccess(`Subscription paused for ${duration} month${duration === '2' ? 's' : ''}. It will auto-resume on the next billing date.`);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pause Subscription"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <PauseCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Pause Subscription</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Pausing your subscription temporarily stops billing. Your equipment remains installed and ready.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select pause duration</p>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="pause_duration"
                value="1"
                checked={duration === '1'}
                onChange={() => setDuration('1')}
                className="text-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">Pause for 1 month</p>
                <p className="text-xs text-gray-500">Resumes automatically on 15 Apr 2025</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="pause_duration"
                value="2"
                checked={duration === '2'}
                onChange={() => setDuration('2')}
                className="text-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">Pause for 2 months</p>
                <p className="text-xs text-gray-500">Resumes automatically on 15 May 2025</p>
              </div>
            </label>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Grid backup charges (₹7/kWh) will still apply if you use grid power during the pause period.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Keep Active
          </button>
          <button
            onClick={handleConfirmPause}
            disabled={confirming}
            className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {confirming ? 'Pausing…' : 'Confirm Pause'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Cancel Subscription Modal ────────────────────────────────────────────────
const CancelSubscriptionModal = ({ onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const canCancel = reason !== '' && understood;

  const handleConfirmCancel = () => {
    if (!canCancel) return;
    setCancelling(true);
    setTimeout(() => {
      setCancelling(false);
      onSuccess('Cancellation request submitted. Our team will contact you within 48 hours to arrange equipment removal.');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cancel Subscription"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700">Cancel Subscription</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            We're sorry to see you go. Please let us know why you're cancelling so we can improve.
          </p>

          <div>
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <select
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option value="">Select a reason…</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-red-800">After cancellation:</p>
            <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5">
              <li>Service ends at the current billing cycle</li>
              <li>Equipment will be retrieved by our team</li>
              <li>Any outstanding grid backup charges will be billed</li>
            </ul>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 accent-red-600"
            />
            <span className="text-xs text-gray-700">
              I understand this action cannot be undone and my subscription will be permanently cancelled.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleConfirmCancel}
            disabled={!canCancel || cancelling}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {cancelling ? 'Cancelling…' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const sub = MOCK_SUBSCRIPTION;
  const usagePct = Math.round((sub.usage_kwh / sub.cycle_limit_kwh) * 100);
  const remaining = sub.cycle_limit_kwh - sub.usage_kwh;

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    // Simulate load
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [user, navigate]);

  const handleSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 6000);
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

      {/* Modals */}
      {showUpgradeModal && (
        <UpgradePlanModal
          onClose={() => setShowUpgradeModal(false)}
          onSuccess={handleSuccessMessage}
        />
      )}
      {showPauseModal && (
        <PauseSubscriptionModal
          onClose={() => setShowPauseModal(false)}
          onSuccess={handleSuccessMessage}
        />
      )}
      {showCancelModal && (
        <CancelSubscriptionModal
          onClose={() => setShowCancelModal(false)}
          onSuccess={handleSuccessMessage}
        />
      )}

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">My Subscription</h1>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError('')} />
            </div>
          )}
          {success && (
            <div className="mb-6">
              <SuccessMessage message={success} onDismiss={() => setSuccess('')} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Current Plan Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Package className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold">Current Plan</h2>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{sub.plan_name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">Energy-as-a-Service subscription</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center text-gray-500 mb-1 gap-1.5">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium uppercase tracking-wide">Solar Capacity</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{sub.solar_capacity} kW</p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500 mb-1 gap-1.5">
                        <Battery className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium uppercase tracking-wide">Battery Capacity</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{sub.battery_capacity} kWh</p>
                    </div>
                  </div>

                  {/* EaaS Value Proposition */}
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    <p className="text-xs font-semibold text-green-800 text-center">
                      ₹0 upfront · Zero hardware cost · Equipment owned and maintained by us
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>Energy rate: ₹{sub.energy_rate}/kWh</span>
                    <span>Grid backup: ₹7/kWh (DISCOM rate)</span>
                  </div>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  This Billing Cycle
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{sub.usage_kwh} kWh used</span>
                    <span className="text-gray-400">of {sub.cycle_limit_kwh} kWh</span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${usagePct}%` }}
                      role="progressbar"
                      aria-valuenow={sub.usage_kwh}
                      aria-valuemin={0}
                      aria-valuemax={sub.cycle_limit_kwh}
                      aria-label="Energy usage this billing cycle"
                    />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-green-700 font-semibold">{usagePct}% used</span>
                    <span className="text-gray-500">{remaining} kWh remaining</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Solar Generated</p>
                    <p className="text-base font-bold text-yellow-600">118 kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Battery Used</p>
                    <p className="text-base font-bold text-blue-600">24 kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Grid Backup</p>
                    <p className="text-base font-bold text-gray-600">0 kWh</p>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Billing Information
                </h3>
                <div className="space-y-3 divide-y divide-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Monthly Fee</span>
                    <span className="font-bold text-gray-900">₹{sub.monthly_fee.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-gray-500 text-sm">Start Date</span>
                    <span className="font-medium text-gray-700">{sub.start_date}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-gray-500 text-sm">Next Billing Date</span>
                    <span className="font-medium text-gray-700">{sub.next_billing_date}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-gray-500 text-sm">Meter Number</span>
                    <span className="font-mono text-sm text-gray-700">{sub.meter_number}</span>
                  </div>
                </div>
              </div>

              {/* Subscription History Timeline */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Subscription History
                </h3>

                <div className="relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200" aria-hidden="true" />

                  <ul className="space-y-6 relative">
                    {HISTORY_TIMELINE.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id} className="flex items-start gap-4 pl-0">
                          {/* Dot + Icon */}
                          <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          {/* Content */}
                          <div className="pt-1">
                            <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-6">

              {/* Actions Card */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/billing')}
                    className="btn btn-outline w-full"
                  >
                    View Bills
                  </button>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                    aria-label="Upgrade to Grid Independent plan"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Upgrade Plan
                  </button>

                  <button
                    onClick={() => setShowPauseModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-amber-400 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
                    aria-label="Pause subscription temporarily"
                  >
                    <PauseCircle className="w-4 h-4" />
                    Pause Subscription
                  </button>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    aria-label="Cancel subscription"
                  >
                    <X className="w-4 h-4" />
                    Cancel Subscription
                  </button>
                </div>
              </div>

              {/* Plan Summary Snapshot */}
              <div className="card bg-gradient-to-br from-green-600 to-green-700 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-200 mb-1">Current Plan</p>
                <h4 className="text-lg font-bold">{sub.plan_name}</h4>
                <p className="text-3xl font-extrabold mt-1">
                  ₹{sub.monthly_fee.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-green-200">/mo</span>
                </p>
                <div className="mt-3 pt-3 border-t border-green-500 text-xs text-green-100 space-y-1">
                  <p>{sub.solar_capacity} kW solar + {sub.battery_capacity} kWh battery</p>
                  <p>₹0 upfront · Hardware maintained by us</p>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="card bg-blue-50 border border-blue-200">
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
