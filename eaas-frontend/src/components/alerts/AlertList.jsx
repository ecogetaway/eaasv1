import { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatDateTime, getTimeAgo } from '../../utils/formatters.js';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const AlertList = ({ showOnlyActive = false }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadAlerts();
    }
  }, [user?.userId, showOnlyActive]);

  const loadAlerts = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const filters = showOnlyActive ? { resolved: false } : {};
      const data = await alertService.getUserAlerts(user.userId, filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await alertService.resolveAlert(alertId);
      setAlerts(alerts.map(a => 
        a.alert_id === alertId 
          ? { ...a, resolved_at: new Date().toISOString() }
          : a
      ));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="card text-center py-8">
        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No alerts</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isResolved = !!alert.resolved_at;
        return (
          <div
            key={alert.alert_id}
            className={`card border-l-4 ${
              isResolved 
                ? 'bg-gray-50 border-gray-300' 
                : getSeverityColor(alert.severity)
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <AlertTriangle 
                  className={`w-5 h-5 mt-0.5 ${
                    isResolved ? 'text-gray-400' : 
                    alert.severity === 'critical' ? 'text-red-600' :
                    alert.severity === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      isResolved ? 'bg-gray-200 text-gray-700' : getSeverityColor(alert.severity)
                    }`}>
                      {alert.severity?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {alert.alert_type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getTimeAgo(alert.triggered_at)}
                    {alert.acknowledged_at && ' • Acknowledged'}
                    {isResolved && ' • Resolved'}
                  </p>
                </div>
              </div>
              {!isResolved && (
                <button
                  onClick={() => handleResolve(alert.alert_id)}
                  className="ml-2 text-gray-400 hover:text-green-600"
                  title="Resolve alert"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertList;

