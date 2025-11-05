import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billingService } from '../../services/billingService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { STATUS_COLORS } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

const BillList = ({ userId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, [userId]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await billingService.getUserBills(userId);
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (billId, e) => {
    e.stopPropagation();
    try {
      await billingService.downloadInvoice(billId);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No bills found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Link
          key={bill.bill_id}
          to={`/billing/${bill.bill_id}`}
          className="card hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold">
                  Bill for {formatDate(bill.billing_period_start)} - {formatDate(bill.billing_period_end)}
                </h3>
                <span className={cn('badge', STATUS_COLORS[bill.status])}>
                  {bill.status}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>Amount: {formatCurrency(bill.total_amount || 0)}</span>
                <span>Savings: {formatCurrency(bill.savings_vs_traditional || 0)}</span>
                <span>Carbon Offset: {(parseFloat(bill.carbon_offset || 0) || 0).toFixed(2)} kg CO₂</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {bill.status === 'paid' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
              <button
                onClick={(e) => handleDownloadInvoice(bill.bill_id, e)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                title="Download Invoice"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BillList;

