import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { discomService } from '../services/discomService.js';
import { 
  FileText, Clock, CheckCircle, AlertCircle, 
  Send, Building2, Zap, Calendar, ChevronRight,
  RefreshCw, MapPin, Home, Info
} from 'lucide-react';

const Discom = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadStatus();
  }, [isAuthenticated, navigate]);

  const loadStatus = async () => {
    const userId = user?.userId || user?.user_id;
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await discomService.getApplicationStatus(userId);
      setStatusData(data);
    } catch (error) {
      console.error('Error loading DISCOM status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatus();
    setRefreshing(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DISCOM Integration</h1>
              <p className="text-gray-600">Net-metering application and grid connection status</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-outline flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : statusData?.hasApplication ? (
            <ApplicationStatus 
              statusData={statusData} 
              onRefresh={loadStatus}
            />
          ) : (
            showForm ? (
              <ApplicationForm 
                userId={user?.userId || user?.user_id}
                onSuccess={() => {
                  setShowForm(false);
                  loadStatus();
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <NoApplicationState onApply={() => setShowForm(true)} />
            )
          )}
        </div>
      </main>
    </div>
  );
};

// No Application State
const NoApplicationState = ({ onApply }) => {
  return (
    <div className="card text-center py-12">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="w-10 h-10 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Apply for Net Metering</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Submit your net-metering application to connect your solar system to the grid 
        and start exporting excess energy.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium">14-21 Days</p>
          <p className="text-xs text-gray-500">Typical approval time</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Zap className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Export Energy</p>
          <p className="text-xs text-gray-500">Earn credits for surplus</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Free Application</p>
          <p className="text-xs text-gray-500">No processing fee</p>
        </div>
      </div>
      
      <button onClick={onApply} className="btn btn-primary px-8">
        Start Application
      </button>
    </div>
  );
};

// Application Form
const ApplicationForm = ({ userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    solar_capacity_kw: '',
    property_type: 'residential',
    property_address: '',
    electricity_provider: 'State Electricity Board',
    consumer_number: '',
    sanctioned_load_kw: '',
    roof_area_sqft: '',
    installation_type: 'rooftop',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.solar_capacity_kw || !formData.property_address || !formData.consumer_number) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await discomService.submitApplication({
        user_id: userId,
        ...formData,
        solar_capacity_kw: parseFloat(formData.solar_capacity_kw),
        sanctioned_load_kw: parseFloat(formData.sanctioned_load_kw) || null,
        roof_area_sqft: parseFloat(formData.roof_area_sqft) || null
      });
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Net Metering Application</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solar System Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary-600" />
            Solar System Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solar Capacity (kW) *
              </label>
              <input
                type="number"
                name="solar_capacity_kw"
                value={formData.solar_capacity_kw}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 5"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Type
              </label>
              <select
                name="installation_type"
                value={formData.installation_type}
                onChange={handleChange}
                className="input"
              >
                <option value="rooftop">Rooftop</option>
                <option value="ground_mounted">Ground Mounted</option>
                <option value="carport">Carport</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-primary-600" />
            Property Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="input"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roof Area (sq ft)
              </label>
              <input
                type="number"
                name="roof_area_sqft"
                value={formData.roof_area_sqft}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Address *
              </label>
              <textarea
                name="property_address"
                value={formData.property_address}
                onChange={handleChange}
                className="input"
                rows={2}
                placeholder="Full installation address"
                required
              />
            </div>
          </div>
        </div>

        {/* Electricity Connection Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary-600" />
            Electricity Connection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity Provider
              </label>
              <select
                name="electricity_provider"
                value={formData.electricity_provider}
                onChange={handleChange}
                className="input"
              >
                <option value="State Electricity Board">State Electricity Board</option>
                <option value="BEST Undertaking">BEST Undertaking</option>
                <option value="Tata Power">Tata Power</option>
                <option value="Adani Electricity">Adani Electricity</option>
                <option value="BSES Rajdhani">BSES Rajdhani</option>
                <option value="BSES Yamuna">BSES Yamuna</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Number *
              </label>
              <input
                type="text"
                name="consumer_number"
                value={formData.consumer_number}
                onChange={handleChange}
                className="input"
                placeholder="Your electricity consumer number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sanctioned Load (kW)
              </label>
              <input
                type="number"
                name="sanctioned_load_kw"
                value={formData.sanctioned_load_kw}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 3"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input"
            rows={3}
            placeholder="Any additional information..."
          />
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Demo Mode</p>
              <p className="text-sm text-blue-700">
                This is a simulated DISCOM application. The application will auto-progress through 
                approval stages every 30 seconds for demonstration purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary flex items-center"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Application Status Component
const ApplicationStatus = ({ statusData, onRefresh }) => {
  const { application, timeline, currentStatusIndex, allStatuses, progressPercentage } = statusData;
  
  const statusColors = {
    'submitted': 'bg-blue-500',
    'under_review': 'bg-blue-500',
    'document_verification': 'bg-yellow-500',
    'site_inspection_scheduled': 'bg-yellow-500',
    'site_inspection_completed': 'bg-yellow-500',
    'technical_approval': 'bg-orange-500',
    'meter_installation': 'bg-orange-500',
    'grid_sync_pending': 'bg-purple-500',
    'approved': 'bg-green-500',
    'grid_connected': 'bg-green-600'
  };

  const statusLabels = {
    'submitted': 'Submitted',
    'under_review': 'Under Review',
    'document_verification': 'Document Verification',
    'site_inspection_scheduled': 'Site Inspection Scheduled',
    'site_inspection_completed': 'Site Inspection Completed',
    'technical_approval': 'Technical Approval',
    'meter_installation': 'Meter Installation',
    'grid_sync_pending': 'Grid Sync Pending',
    'approved': 'Approved',
    'grid_connected': 'Grid Connected'
  };

  const isCompleted = application.status === 'grid_connected';
  const isApproved = application.status === 'approved' || isCompleted;

  return (
    <div className="space-y-6">
      {/* Status Overview Card */}
      <div className={`card ${isCompleted ? 'bg-green-50 border-green-200' : isApproved ? 'bg-blue-50 border-blue-200' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Application Number</p>
            <p className="text-xl font-bold font-mono">{application.application_number}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${statusColors[application.status]}`}>
            {statusLabels[application.status]}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium capitalize">{application.application_type?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Solar Capacity</p>
            <p className="font-medium">{application.solar_capacity_kw} kW</p>
          </div>
          <div>
            <p className="text-gray-500">Property Type</p>
            <p className="font-medium capitalize">{application.property_type}</p>
          </div>
          <div>
            <p className="text-gray-500">Submitted</p>
            <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Congratulations! Your solar system is now connected to the grid.</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You can now export excess energy and earn net metering credits.
            </p>
          </div>
        )}
      </div>

      {/* Timeline Card */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Application Timeline</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {/* Timeline Items */}
          <div className="space-y-6">
            {allStatuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const timelineEntry = timeline?.find(t => t.status === status);
              
              return (
                <div key={status} className="relative flex items-start pl-10">
                  {/* Status Icon */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${isCompleted 
                      ? `${statusColors[status]} border-transparent` 
                      : 'bg-white border-gray-300'
                    }
                    ${isCurrent ? 'ring-4 ring-primary-100' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  
                  {/* Status Content */}
                  <div className={`flex-1 ${!isCompleted ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${isCurrent ? 'text-primary-600' : ''}`}>
                        {statusLabels[status]}
                      </p>
                      {timelineEntry && (
                        <span className="text-xs text-gray-500">
                          {new Date(timelineEntry.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {timelineEntry && (
                      <p className="text-sm text-gray-600 mt-1">{timelineEntry.message}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Property & Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-600" />
            Property Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{application.property_address}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Property Type</span>
              <span className="font-medium capitalize">{application.property_type}</span>
            </div>
            {application.roof_area_sqft && (
              <div className="flex justify-between">
                <span className="text-gray-500">Roof Area</span>
                <span className="font-medium">{application.roof_area_sqft} sq ft</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary-600" />
            Connection Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span className="font-medium">{application.electricity_provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Consumer No.</span>
              <span className="font-medium">{application.consumer_number}</span>
            </div>
            {application.sanctioned_load_kw && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sanctioned Load</span>
                <span className="font-medium">{application.sanctioned_load_kw} kW</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Demo Mode Active</p>
            <p className="text-sm text-blue-700">
              Your application will automatically progress through approval stages. 
              Use the refresh button to see the latest status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discom;

