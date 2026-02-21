import { Zap, CheckCircle, AlertCircle, Activity, Gauge } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters.js';

const GridSyncDetailsCard = ({ gridSync }) => {
  if (!gridSync) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-primary-600" />
        Grid Synchronization
      </h3>
      
      <div className="space-y-3">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Sync Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            gridSync.status === 'synchronized' 
              ? 'bg-green-100 text-green-700' 
              : gridSync.status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {gridSync.status === 'synchronized' ? 'Synchronized' : 
             gridSync.status === 'pending' ? 'Pending' : 'Not Started'}
          </span>
        </div>

        {/* Meter Details */}
        {gridSync.meter_number && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Bi-directional Meter Number</span>
            <span className="text-sm font-mono font-medium">{gridSync.meter_number}</span>
          </div>
        )}

        {gridSync.meter_type && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Meter Type</span>
            <span className="text-sm font-medium">{gridSync.meter_type}</span>
          </div>
        )}

        {gridSync.installation_date && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Installation Date</span>
            <span className="text-sm font-medium">
              {formatDate(gridSync.installation_date)}
            </span>
          </div>
        )}

        {gridSync.synchronized_at && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Synchronized At</span>
            <span className="text-sm font-medium">
              {formatDateTime(gridSync.synchronized_at)}
            </span>
          </div>
        )}

        {/* Export Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Grid Export</span>
          <span className={`flex items-center text-sm font-medium ${
            gridSync.export_enabled ? 'text-green-600' : 'text-gray-600'
          }`}>
            {gridSync.export_enabled ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Enabled
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                Disabled
              </>
            )}
          </span>
        </div>

        {/* Anti-Islanding Protection */}
        {gridSync.anti_islanding_protection && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              Anti-Islanding Protection
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-green-700">Status:</span>
                <span className={`font-medium ${
                  gridSync.anti_islanding_protection.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {gridSync.anti_islanding_protection.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              {gridSync.anti_islanding_protection.tested && (
                <div className="flex justify-between">
                  <span className="text-green-700">Tested:</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              )}
              {gridSync.anti_islanding_protection.test_date && (
                <div className="flex justify-between">
                  <span className="text-green-700">Test Date:</span>
                  <span className="font-medium text-green-600">
                    {formatDate(gridSync.anti_islanding_protection.test_date)}
                  </span>
                </div>
              )}
              {gridSync.anti_islanding_protection.compliance && (
                <div className="flex justify-between">
                  <span className="text-green-700">Compliance:</span>
                  <span className="font-medium text-green-600">
                    {gridSync.anti_islanding_protection.compliance}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Voltage and Frequency Alignment */}
        {gridSync.voltage_frequency_alignment && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Gauge className="w-4 h-4 mr-1" />
              Voltage & Frequency Alignment
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-blue-700 mb-1">Voltage</p>
                <p className="font-semibold text-blue-900">{gridSync.voltage_frequency_alignment.voltage}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Frequency</p>
                <p className="font-semibold text-blue-900">{gridSync.voltage_frequency_alignment.frequency}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">Alignment Status:</span>
                <span className={`text-xs font-medium ${
                  gridSync.voltage_frequency_alignment.status === 'aligned' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {gridSync.voltage_frequency_alignment.status === 'aligned' ? 'Aligned' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Last Sync */}
        {gridSync.last_sync_at && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Last Sync</span>
            <span className="text-sm font-medium">
              {formatDateTime(gridSync.last_sync_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridSyncDetailsCard;

