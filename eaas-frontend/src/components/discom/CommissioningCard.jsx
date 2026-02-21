import { FileCheck, CheckCircle, Calendar, Lock, AlertCircle } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters.js';

const CommissioningCard = ({ commissioning, inspectionDocumentation }) => {
  if (!commissioning && !inspectionDocumentation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Inspection and Documentation */}
      {inspectionDocumentation && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-primary-600" />
            Inspection & Documentation
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                inspectionDocumentation.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {inspectionDocumentation.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>

            {inspectionDocumentation.inspection_date && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Inspection Date</span>
                <span className="text-sm font-medium">
                  {formatDate(inspectionDocumentation.inspection_date)}
                </span>
              </div>
            )}

            {inspectionDocumentation.inspected_by && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Inspected By</span>
                <span className="text-sm font-medium">{inspectionDocumentation.inspected_by}</span>
              </div>
            )}

            {/* Electrical Test Results */}
            {inspectionDocumentation.electrical_test_results && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">Electrical Test Results</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-green-700">Voltage Alignment:</span>
                    <span className="ml-1 font-medium text-green-900">
                      {inspectionDocumentation.electrical_test_results.voltage_alignment}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Frequency Alignment:</span>
                    <span className="ml-1 font-medium text-green-900">
                      {inspectionDocumentation.electrical_test_results.frequency_alignment}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Power Factor:</span>
                    <span className="ml-1 font-medium text-green-900">
                      {inspectionDocumentation.electrical_test_results.power_factor}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Insulation Resistance:</span>
                    <span className="ml-1 font-medium text-green-900">
                      {inspectionDocumentation.electrical_test_results.insulation_resistance}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Earth Resistance:</span>
                    <span className="ml-1 font-medium text-green-900">
                      {inspectionDocumentation.electrical_test_results.earth_resistance}
                    </span>
                  </div>
                </div>
                {inspectionDocumentation.electrical_test_results.test_certificate_number && (
                  <p className="text-xs text-green-800 mt-2">
                    Test Certificate: {inspectionDocumentation.electrical_test_results.test_certificate_number}
                  </p>
                )}
              </div>
            )}

            {/* Commissioning Certificate */}
            {inspectionDocumentation.commissioning_certificate && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1 flex items-center">
                  <FileCheck className="w-4 h-4 mr-1" />
                  Commissioning Certificate
                </p>
                <p className="text-xs text-blue-800 font-mono">
                  {inspectionDocumentation.commissioning_certificate.certificate_number}
                </p>
                {inspectionDocumentation.commissioning_certificate.issued_date && (
                  <p className="text-xs text-blue-700 mt-1">
                    Issued: {formatDate(inspectionDocumentation.commissioning_certificate.issued_date)}
                  </p>
                )}
                {inspectionDocumentation.commissioning_certificate.issued_by && (
                  <p className="text-xs text-blue-700">
                    By: {inspectionDocumentation.commissioning_certificate.issued_by}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commissioning */}
      {commissioning && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-primary-600" />
            Commissioning
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                commissioning.status === 'complete' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {commissioning.status === 'complete' ? 'Complete' : 'Pending'}
              </span>
            </div>

            {commissioning.commissioning_date && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Commissioning Date</span>
                <span className="text-sm font-medium">
                  {formatDate(commissioning.commissioning_date)}
                </span>
              </div>
            )}

            {commissioning.commissioning_report_number && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Report Number</span>
                <span className="text-sm font-mono font-medium">{commissioning.commissioning_report_number}</span>
              </div>
            )}

            {/* Meter Sealing */}
            {commissioning.meter_sealing_status && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Meter Sealing
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className={`font-medium ${
                      commissioning.meter_sealing_status === 'sealed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {commissioning.meter_sealing_status === 'sealed' ? 'Sealed' : 'Pending'}
                    </span>
                  </div>
                  {commissioning.meter_sealed_by && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Sealed By:</span>
                      <span className="font-medium text-blue-900">{commissioning.meter_sealed_by}</span>
                    </div>
                  )}
                  {commissioning.meter_sealed_at && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Sealed At:</span>
                      <span className="font-medium text-blue-900">
                        {formatDateTime(commissioning.meter_sealed_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Billing Cycle */}
            {commissioning.billing_cycle_start && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Billing Cycle
                </p>
                <p className="text-xs text-green-800">
                  Billing cycle started: {formatDate(commissioning.billing_cycle_start)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Net metering is now active. You can export excess energy and earn credits.
                </p>
              </div>
            )}

            {/* Net Metering Status */}
            {commissioning.net_metering_active !== undefined && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Net Metering Active</span>
                <span className={`flex items-center text-sm font-medium ${
                  commissioning.net_metering_active ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {commissioning.net_metering_active ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissioningCard;

