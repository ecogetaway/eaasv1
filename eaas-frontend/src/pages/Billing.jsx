import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Leaf, Zap, TrendingDown } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import BillList from '../components/billing/BillList.jsx';
import RazorpayMock from '../components/payment/RazorpayMock.jsx';
import { mockBills } from '../data/mockData.js';

const FIXED_TXN_ID = 'TXN2024112600001';

const formatCurrencyCompact = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatMonthLabel = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { month: 'short' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-green-700 font-bold">
        {formatCurrencyCompact(payload[0].value)}
      </p>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Billing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bills, setBills] = useState([...mockBills]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const totalSaved = useMemo(
    () => bills.reduce((sum, b) => sum + parseFloat(b.savings_vs_traditional || 0), 0),
    [bills]
  );

  const totalCO2 = useMemo(
    () => bills.reduce((sum, b) => sum + parseFloat(b.carbon_offset || 0), 0),
    [bills]
  );

  const chartData = useMemo(
    () =>
      [...bills]
        .reverse()
        .map((b) => ({
          month: formatMonthLabel(b.billing_period_start),
          amount: parseFloat(b.total_amount),
          status: b.status,
        })),
    [bills]
  );

  if (!isAuthenticated) return null;

  const handlePayClick = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!selectedBill) return;
    setBills((prev) =>
      prev.map((b) =>
        b.bill_id === selectedBill.bill_id
          ? { ...b, status: 'paid', payment_date: new Date().toISOString() }
          : b
      )
    );
    setTimeout(() => setShowPaymentModal(false), 3500);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Page title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Billing</h1>
            <p className="text-sm text-gray-500 mt-1">
              June 2024 – November 2024 · Solar Starter Plan
            </p>
          </div>

          {/* Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard
              icon={TrendingDown}
              label="Total Saved to Date"
              value={formatCurrencyCompact(totalSaved)}
              sub="vs. traditional electricity"
              color="bg-green-600"
            />
            <SummaryCard
              icon={Leaf}
              label="Total CO₂ Offset"
              value={`${totalCO2.toFixed(0)} kg`}
              sub={`≈ ${Math.round(totalCO2 / 21)} trees planted`}
              color="bg-emerald-500"
            />
            <SummaryCard
              icon={Zap}
              label="Current Plan"
              value="Solar Starter"
              sub="₹1,799/mo · 3 kW solar · ₹4.50/kWh"
              color="bg-blue-600"
            />
          </div>

          {/* Monthly Spend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Monthly Spend</h2>
            <p className="text-xs text-gray-400 mb-4">Last 6 months (Jun – Nov 2024)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === 'pending' ? '#f59e0b' : '#16a34a'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />
                Paid
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Pending payment
              </span>
            </div>
          </div>

          {/* Bill History */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Bill History</h2>
            <BillList bills={bills} onPayClick={handlePayClick} />
          </div>

        </div>
      </main>

      {/* Payment Modal */}
      {selectedBill && (
        <RazorpayMock
          isOpen={showPaymentModal}
          onClose={handleCloseModal}
          amount={parseFloat(selectedBill.total_amount)}
          description={`Bill Payment – Solar Starter Plan`}
          onSuccess={handlePaymentSuccess}
          merchantName="EaaS Energy Services"
          transactionId={FIXED_TXN_ID}
        />
      )}
    </div>
  );
};

export default Billing;
