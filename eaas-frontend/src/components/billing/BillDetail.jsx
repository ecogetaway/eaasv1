import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billingService } from '../../services/billingService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import RazorpayMock from '../payment/RazorpayMock.jsx';
import { Download, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';

const BillDetail = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

  const loadBill = async () => {
    try {
      setLoading(true);
      const data = await billingService.getBillById(billId);
      setBill(data);
    } catch (error) {
      console.error('Error loading bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      // Process payment on backend
      await billingService.processPayment(billId, { 
        payment_method: paymentDetails.method,
        transaction_id: paymentDetails.paymentId
      });
      
      // Wait for modal to close animation
      setTimeout(() => {
        setShowPaymentModal(false);
      loadBill(); // Reload bill to show updated status
      }, 500);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleDownloadInvoice = async () => {
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

  if (!bill) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Bill not found</p>
      </div>
    );
  }

  const traditionalBill = bill.total_amount + bill.savings_vs_traditional;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/billing')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bills
      </button>

      <div className="card mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bill Details</h2>
            <p className="text-gray-600">
              {formatDate(bill.billing_period_start)} - {formatDate(bill.billing_period_end)}
            </p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            className="btn btn-outline flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Consumption</div>
            <div className="text-xl font-semibold">{parseFloat(bill.total_consumption).toFixed(2)} kWh</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Solar Units Generated</div>
            <div className="text-xl font-semibold text-green-600">{parseFloat(bill.solar_units || 0).toFixed(2)} kWh</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Grid Units</div>
            <div className="text-xl font-semibold">{parseFloat(bill.grid_units || 0).toFixed(2)} kWh</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Export Units</div>
            <div className="text-xl font-semibold text-blue-600">{parseFloat(bill.export_units || 0).toFixed(2)} kWh</div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Charges Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subscription Charge</span>
              <span className="font-semibold">{formatCurrency(bill.subscription_charge)}</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Energy ({parseFloat(bill.grid_units || 0).toFixed(2)} units @ ₹7.5/unit)</span>
              <span className="font-semibold">{formatCurrency(bill.energy_charge)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Net Metering Credit ({parseFloat(bill.export_units || 0).toFixed(2)} units @ ₹5.0/unit)</span>
              <span className="font-semibold">-{formatCurrency(bill.net_metering_credit || bill.export_credit || 0)}</span>
            </div>
            {bill.tax_amount && bill.tax_amount > 0 && (
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold">{formatCurrency(bill.tax_amount)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span>{formatCurrency(bill.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">Savings vs Traditional</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Traditional Bill</span>
              <span className="line-through">{formatCurrency(traditionalBill)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">EaaS Bill</span>
              <span className="font-semibold">{formatCurrency(bill.total_amount)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-green-700">
              <span>You Saved</span>
              <span>{formatCurrency(bill.savings_vs_traditional)}</span>
            </div>
            <div className="text-sm text-green-600 mt-2">
              {((bill.savings_vs_traditional / traditionalBill) * 100).toFixed(1)}% savings
            </div>
          </div>
        </div>

        <div className="card bg-emerald-50 border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-4">Carbon Impact</h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-emerald-700">
              {parseFloat(bill.carbon_offset || 0).toFixed(2)} kg CO₂
            </div>
            <div className="text-sm text-emerald-600">
              Equivalent to {Math.round(bill.carbon_offset / 20)} trees
            </div>
          </div>
        </div>
      </div>

      {bill.status === 'pending' && (
        <div className="card mt-6">
          <h3 className="font-semibold mb-4">Make Payment</h3>
          <p className="text-gray-600 mb-4">
            Complete your payment securely using UPI, Cards, Net Banking, or Wallets.
          </p>
            <button
            onClick={() => setShowPaymentModal(true)}
              className="btn btn-primary w-full flex items-center justify-center"
            >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(bill.total_amount)}
            </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Demo mode: No actual charges will be made
          </p>
        </div>
      )}

      {bill.status === 'paid' && (
        <div className="card bg-green-50 border-green-200 mt-6">
          <div className="flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-semibold">Payment Completed</span>
          </div>
          {bill.payment_date && (
            <p className="text-sm text-green-600 mt-2">
              Paid on {formatDate(bill.payment_date)}
            </p>
          )}
        </div>
      )}

      {/* Razorpay Mock Payment Modal */}
      <RazorpayMock
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={parseFloat(bill.total_amount)}
        description={`Bill Payment - ${formatDate(bill.billing_period_start)} to ${formatDate(bill.billing_period_end)}`}
        onSuccess={handlePaymentSuccess}
        merchantName="EaaS Energy Services"
      />
    </div>
  );
};

export default BillDetail;
