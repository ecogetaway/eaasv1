import { TrendingUp, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

const SavingsCard = ({ dashboardSummary }) => {
  if (!dashboardSummary) {
    return (
      <div className="card animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const todaySavings = parseFloat(dashboardSummary.today?.savings || 0);
  const monthSavings = parseFloat(dashboardSummary.month?.savings || 0);

  return (
    <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-900">Your Savings</h3>
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center text-sm text-green-700 mb-1">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span>Today</span>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {formatCurrency(todaySavings)}
          </div>
        </div>
        
        <div className="border-t border-green-200 pt-4">
          <div className="flex items-center text-sm text-green-700 mb-1">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span>This Month</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(monthSavings)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCard;

