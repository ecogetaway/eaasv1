import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Download,
  CreditCard,
  Leaf,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

const formatBillDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatMonthYear = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const startLabel = start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const endLabel = end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${startLabel} – ${endLabel}`;
};

const StatusBadge = ({ status }) => {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
};

const BreakdownRow = ({ label, value, highlight, isCredit, isTotal }) => (
  <div
    className={`flex justify-between items-center py-2 ${
      isTotal
        ? 'border-t border-gray-200 mt-1 pt-3 font-bold text-gray-900 text-base'
        : 'text-sm text-gray-600'
    }`}
  >
    <span className={highlight ? 'font-medium text-gray-800' : ''}>{label}</span>
    <span
      className={
        isCredit
          ? 'text-green-600 font-semibold'
          : isTotal
          ? 'text-gray-900'
          : 'font-medium text-gray-800'
      }
    >
      {isCredit ? `–${value}` : value}
    </span>
  </div>
);

const BillCard = ({ bill, onPayClick }) => {
  const [expanded, setExpanded] = useState(bill.status === 'pending');

  const handleDownload = (e) => {
    e.stopPropagation();
    window.print();
  };

  const handlePayClick = (e) => {
    e.stopPropagation();
    onPayClick(bill);
  };

  const energyConsumed = parseFloat(bill.total_consumption || 0);
  const gridUnits = parseFloat(bill.grid_units || 0);
  const exportUnits = parseFloat(bill.export_units || 0);

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 ${
        bill.status === 'pending'
          ? 'border-amber-200 shadow-md shadow-amber-50'
          : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Card Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-xl"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: period + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-gray-900 leading-snug">
                {formatMonthYear(bill.billing_period_start, bill.billing_period_end)}
              </h3>
              <StatusBadge status={bill.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>
                Amount:{' '}
                <span className="font-semibold text-gray-800">
                  {formatCurrency(bill.total_amount)}
                </span>
              </span>
              <span>
                Savings:{' '}
                <span className="font-semibold text-green-700">
                  {formatCurrency(bill.savings_vs_traditional)}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-green-600" />
                <span className="font-semibold text-green-700">
                  {parseFloat(bill.carbon_offset).toFixed(1)} kg CO₂
                </span>
              </span>
            </div>
          </div>

          {/* Right: actions + chevron */}
          <div className="flex items-center gap-1.5 shrink-0">
            {bill.status === 'paid' && (
              <CheckCircle className="w-5 h-5 text-green-600" aria-label="Paid" />
            )}
            {bill.status === 'pending' && (
              <Clock className="w-5 h-5 text-amber-500" aria-label="Pending" />
            )}
            <button
              type="button"
              onClick={handleDownload}
              aria-label="Download invoice"
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Breakdown */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
          <div className="pt-3">
            {/* Energy stats */}
            <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-500">Total Consumed</p>
                <p className="text-sm font-semibold text-gray-800">{energyConsumed.toFixed(1)} kWh</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500">Grid Import</p>
                <p className="text-sm font-semibold text-gray-800">{gridUnits.toFixed(1)} kWh</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Leaf className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-gray-500">Net Metered</p>
                <p className="text-sm font-semibold text-green-700">{exportUnits.toFixed(1)} kWh</p>
              </div>
            </div>

            {/* Charges breakdown */}
            <div className="divide-y divide-gray-100">
              <BreakdownRow
                label="Subscription Fee (Solar Starter)"
                value={formatCurrency(bill.subscription_charge)}
              />
              <BreakdownRow
                label={`Energy Consumed (${energyConsumed.toFixed(1)} kWh @ ₹4.50/kWh)`}
                value={formatCurrency(bill.energy_charge)}
              />
              <BreakdownRow
                label={`Grid Import Charges (${gridUnits.toFixed(1)} kWh @ ₹7/kWh)`}
                value={formatCurrency(bill.energy_charge)}
              />
              <BreakdownRow
                label={`Net Metering Credits (${exportUnits.toFixed(1)} kWh @ ₹5/kWh)`}
                value={formatCurrency(bill.net_metering_credit)}
                isCredit
              />
              <BreakdownRow
                label="GST (18%)"
                value={formatCurrency(bill.tax_amount)}
              />
              <BreakdownRow
                label="Total Amount Due"
                value={formatCurrency(bill.total_amount)}
                isTotal
              />
            </div>

            {/* Due date or paid date */}
            <p className="text-xs text-gray-400 mt-3">
              {bill.status === 'paid'
                ? `Paid on ${formatBillDate(bill.payment_date)}`
                : `Due by ${formatBillDate(bill.due_date)}`}
            </p>

            {/* Pay Now button for pending bills */}
            {bill.status === 'pending' && (
              <button
                type="button"
                onClick={handlePayClick}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now — {formatCurrency(bill.total_amount)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BillList = ({ bills, onPayClick }) => {
  if (!bills || bills.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No bills found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <BillCard key={bill.bill_id} bill={bill} onPayClick={onPayClick} />
      ))}
    </div>
  );
};

export default BillList;
