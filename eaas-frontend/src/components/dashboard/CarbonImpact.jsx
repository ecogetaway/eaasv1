import { Leaf, Trees } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';

const CarbonImpact = ({ dashboardSummary }) => {
  if (!dashboardSummary) {
    return (
      <div className="card animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const todayCarbon = parseFloat(dashboardSummary.today?.carbon_offset || 0);
  const monthCarbon = parseFloat(dashboardSummary.month?.carbon_offset || 0);
  const treesEquivalent = Math.round(monthCarbon / 20); // 1 tree = 20 kg CO₂/year

  return (
    <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-emerald-900">Carbon Impact</h3>
        <Leaf className="w-6 h-6 text-emerald-600" />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-emerald-700 mb-1">Today's Offset</div>
          <div className="text-3xl font-bold text-emerald-900">
            {formatNumber(todayCarbon, 2)} kg CO₂
          </div>
        </div>
        
        <div className="border-t border-emerald-200 pt-4">
          <div className="text-sm text-emerald-700 mb-1">This Month</div>
          <div className="text-2xl font-bold text-emerald-900 mb-2">
            {formatNumber(monthCarbon, 2)} kg CO₂
          </div>
          <div className="flex items-center text-emerald-700">
            <Trees className="w-4 h-4 mr-1" />
            <span className="text-sm">Equivalent to {treesEquivalent} trees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonImpact;

