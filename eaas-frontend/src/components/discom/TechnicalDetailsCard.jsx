import { FileCheck, CheckCircle, AlertCircle, Zap, Building2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

const TechnicalDetailsCard = ({ technicalApproval, feasibilityStudy, systemInstallation }) => {
  if (!technicalApproval && !feasibilityStudy && !systemInstallation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Feasibility Study */}
      {feasibilityStudy && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-primary-600" />
            Feasibility Study
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                feasibilityStudy.status === 'approved' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {feasibilityStudy.status === 'approved' ? 'Approved' : 'In Progress'}
              </span>
            </div>
            
            {feasibilityStudy.conducted_at && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Conducted On</span>
                <span className="text-sm font-medium">
                  {formatDate(feasibilityStudy.conducted_at)}
                </span>
              </div>
            )}
            
            {feasibilityStudy.grid_capacity_available !== undefined && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Grid Capacity Available</span>
                <span className={`flex items-center text-sm font-medium ${
                  feasibilityStudy.grid_capacity_available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feasibilityStudy.grid_capacity_available ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Yes
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-1" />
                      No
                    </>
                  )}
                </span>
              </div>
            )}
            
            {feasibilityStudy.proposed_solar_capacity_kw && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Proposed Solar Capacity</p>
                  <p className="text-sm font-semibold">{feasibilityStudy.proposed_solar_capacity_kw} kW</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Grid Capacity</p>
                  <p className="text-sm font-semibold">{feasibilityStudy.grid_capacity_kw || 'N/A'} kW</p>
                </div>
              </div>
            )}
            
            {feasibilityStudy.capacity_utilization_percent && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Capacity Utilization</span>
                  <span className="font-medium">{feasibilityStudy.capacity_utilization_percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      feasibilityStudy.capacity_utilization_percent < 50 ? 'bg-green-500' :
                      feasibilityStudy.capacity_utilization_percent < 80 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(feasibilityStudy.capacity_utilization_percent, 100)}%` }}
                  />
                </div>
              </div>
            )}
            
            {feasibilityStudy.remarks && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{feasibilityStudy.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Approval */}
      {technicalApproval && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-primary-600" />
            Technical Approval
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                technicalApproval.status === 'approved' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {technicalApproval.status === 'approved' ? 'Approved' : 'Pending'}
              </span>
            </div>
            
            {technicalApproval.approval_letter_number && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Approval Letter Number</span>
                <span className="text-sm font-mono font-medium">{technicalApproval.approval_letter_number}</span>
              </div>
            )}
            
            {technicalApproval.approval_date && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Approval Date</span>
                <span className="text-sm font-medium">
                  {formatDate(technicalApproval.approval_date)}
                </span>
              </div>
            )}
            
            {technicalApproval.approved_by && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Approved By</span>
                <span className="text-sm font-medium">{technicalApproval.approved_by}</span>
              </div>
            )}
            
            {technicalApproval.validity_period_days && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Validity Period</span>
                <span className="text-sm font-medium">{technicalApproval.validity_period_days} days</span>
              </div>
            )}
            
            {technicalApproval.conditions && technicalApproval.conditions.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Conditions:</p>
                <ul className="space-y-1">
                  {technicalApproval.conditions.map((condition, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Installation */}
      {systemInstallation && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary-600" />
            System Installation
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                systemInstallation.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {systemInstallation.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            {systemInstallation.installation_date && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Installation Date</span>
                <span className="text-sm font-medium">
                  {formatDate(systemInstallation.installation_date)}
                </span>
              </div>
            )}
            
            {systemInstallation.installer_name && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Installer</span>
                <span className="text-sm font-medium">{systemInstallation.installer_name}</span>
              </div>
            )}
            
            {systemInstallation.installation_certificate_number && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Certificate Number</span>
                <span className="text-sm font-mono font-medium">{systemInstallation.installation_certificate_number}</span>
              </div>
            )}
            
            {systemInstallation.equipment_compliance && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Equipment Compliance
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <span className={systemInstallation.equipment_compliance.cea_compliant ? 'text-green-600' : 'text-red-600'}>
                      {systemInstallation.equipment_compliance.cea_compliant ? '✓' : '✗'} CEA Compliant
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={systemInstallation.equipment_compliance.bis_compliant ? 'text-green-600' : 'text-red-600'}>
                      {systemInstallation.equipment_compliance.bis_compliant ? '✓' : '✗'} BIS Compliant
                    </span>
                  </div>
                </div>
                {systemInstallation.equipment_compliance.inverter_brand && (
                  <p className="text-xs text-green-800 mt-2">
                    Inverter: {systemInstallation.equipment_compliance.inverter_brand} {systemInstallation.equipment_compliance.inverter_model}
                  </p>
                )}
                {systemInstallation.equipment_compliance.panel_brand && (
                  <p className="text-xs text-green-800">
                    Panels: {systemInstallation.equipment_compliance.panel_brand} ({systemInstallation.equipment_compliance.panel_capacity_w}W each)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalDetailsCard;

