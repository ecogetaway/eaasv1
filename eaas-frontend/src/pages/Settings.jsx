import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import { authService } from '../services/authService.js';
import {
  User,
  Bell,
  Shield,
  Link2,
  CheckCircle,
  Mail,
  Smartphone,
} from 'lucide-react';

const INDIAN_CITIES = [
  'Mumbai',
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Delhi',
];

const NOTIFICATION_TYPES = [
  { key: 'billGenerated', label: 'Bill Generated' },
  { key: 'paymentDueReminder', label: 'Payment Due Reminder' },
  { key: 'solarPerformanceAlert', label: 'Solar Performance Alert' },
  { key: 'powerOutageAlert', label: 'Power Outage Alert' },
  { key: 'savingsMilestone', label: 'Savings Milestone' },
];

const ToggleSwitch = ({ checked, onChange, label, id }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    id={id}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      checked ? 'bg-green-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
      aria-hidden="true"
    />
  </button>
);

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [showAddMeterForm, setShowAddMeterForm] = useState(false);

  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    billGenerated: { enabled: true, email: true, sms: true },
    paymentDueReminder: { enabled: true, email: true, sms: false },
    solarPerformanceAlert: { enabled: true, email: true, sms: true },
    powerOutageAlert: { enabled: true, email: true, sms: true },
    savingsMilestone: { enabled: true, email: true, sms: false },
  });

  const [newMeterForm, setNewMeterForm] = useState({
    meterId: '',
    meterType: 'Bi-directional Smart Meter',
    location: '',
  });

  const [meters, setMeters] = useState([
    {
      meter_id: 'ISM-MH-004892',
      last_sync: '2 mins ago',
      signal: 'Strong',
      signalColor: 'bg-green-500',
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      const { user: profileUser } = await authService.getProfile();
      if (profileUser) {
        setAccountForm({
          name: profileUser.name || '',
          email: profileUser.email || '',
          phone: profileUser.phone || '',
          address: profileUser.address || '',
          city: profileUser.city || 'Bengaluru',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      if (user) {
        setAccountForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || 'Bengaluru',
        });
      }
    }
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(accountForm);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (err) {
      console.error('Error saving account:', err);
    }
  };

  const handleNotificationToggle = (key, field, value) => {
    setNotificationPrefs((prev) => {
      const next = { ...prev };
      if (field === 'enabled') {
        next[key] = { ...prev[key], enabled: value };
      } else {
        next[key] = { ...prev[key], [field]: value };
      }
      return next;
    });
  };

  const handleAddMeter = (e) => {
    e.preventDefault();
    if (!newMeterForm.meterId.trim()) return;
    setMeters((prev) => [
      ...prev,
      {
        meter_id: newMeterForm.meterId.trim(),
        last_sync: 'Just now',
        signal: 'Strong',
        signalColor: 'bg-green-500',
      },
    ]);
    setNewMeterForm({ meterId: '', meterType: 'Bi-directional Smart Meter', location: '' });
    setShowAddMeterForm(false);
  };

  const handleNewMeterInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeterForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* Toast */}
          {toastVisible && (
            <div
              className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg"
              role="alert"
              aria-live="polite"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Changes saved successfully!</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Account Settings - Expanded */}
            <section className="card">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Account Settings</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Manage your account information and preferences.
              </p>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    name="email"
                    value={accountForm.email}
                    onChange={handleAccountInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="settings-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    id="settings-phone"
                    type="tel"
                    name="phone"
                    value={accountForm.phone}
                    onChange={handleAccountInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="settings-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="settings-address"
                    name="address"
                    value={accountForm.address}
                    onChange={handleAccountInputChange}
                    className="input"
                    rows="3"
                  />
                </div>
                <div>
                  <label htmlFor="settings-city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    id="settings-city"
                    name="city"
                    value={accountForm.city}
                    onChange={handleAccountInputChange}
                    className="input"
                  >
                    {INDIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </section>

            {/* Notification Preferences - Expanded */}
            <section className="card">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Configure how you receive notifications about your energy system.
              </p>
              <div className="space-y-4">
                {NOTIFICATION_TYPES.map(({ key, label }) => {
                  const prefs = notificationPrefs[key];
                  const isEnabled = prefs?.enabled ?? false;
                  return (
                    <div key={key} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <ToggleSwitch
                          checked={isEnabled}
                          onChange={(v) => handleNotificationToggle(key, 'enabled', v)}
                          label={`Toggle ${label}`}
                          id={`toggle-${key}`}
                        />
                      </div>
                      {isEnabled && (
                        <div className="mt-3 pl-1 flex flex-wrap gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prefs.email}
                              onChange={(e) =>
                                handleNotificationToggle(key, 'email', e.target.checked)
                              }
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            />
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Email</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prefs.sms}
                              onChange={(e) =>
                                handleNotificationToggle(key, 'sms', e.target.checked)
                              }
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            />
                            <Smartphone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">SMS</span>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Smart Meter Integration - Expanded */}
            <section className="card">
              <div className="flex items-center mb-6">
                <Link2 className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Smart Meter Integration</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Connect and manage your smart meters for real-time energy monitoring.
              </p>
              <div className="space-y-4">
                {meters.map((meter) => (
                  <div
                    key={meter.meter_id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">ID: {meter.meter_id}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Last Sync: {meter.last_sync}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${meter.signalColor || 'bg-green-500'}`}
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">{meter.signal}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {showAddMeterForm ? (
                  <form onSubmit={handleAddMeter} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="font-medium text-gray-900">Add New Meter</h3>
                    <div>
                      <label htmlFor="new-meter-id" className="block text-sm font-medium text-gray-700 mb-2">
                        Meter ID
                      </label>
                      <input
                        id="new-meter-id"
                        type="text"
                        name="meterId"
                        value={newMeterForm.meterId}
                        onChange={handleNewMeterInputChange}
                        placeholder="e.g. ISM-MH-004893"
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-meter-type" className="block text-sm font-medium text-gray-700 mb-2">
                        Meter Type
                      </label>
                      <select
                        id="new-meter-type"
                        name="meterType"
                        value={newMeterForm.meterType}
                        onChange={handleNewMeterInputChange}
                        className="input"
                      >
                        <option>Bi-directional Smart Meter</option>
                        <option>Single-phase Smart Meter</option>
                        <option>Three-phase Smart Meter</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="new-meter-location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        id="new-meter-location"
                        type="text"
                        name="location"
                        value={newMeterForm.location}
                        onChange={handleNewMeterInputChange}
                        placeholder="e.g. Main Panel"
                        className="input"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Add Meter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMeterForm(false);
                          setNewMeterForm({
                            meterId: '',
                            meterType: 'Bi-directional Smart Meter',
                            location: '',
                          });
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddMeterForm(true)}
                    className="btn btn-outline w-full sm:w-auto"
                  >
                    Add New Meter
                  </button>
                )}
              </div>
            </section>

            {/* DISCOM Integration - Unchanged */}
            <section className="card">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">DISCOM Approvals</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Integration with Smart Meter and DISCOM approvals managed here.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">
                  DISCOM integration features will be available soon. Contact support for
                  assistance with utility approvals.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
