import moment from 'moment';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return moment(date).format('DD MMM YYYY');
};

export const formatDateTime = (date) => {
  return moment(date).format('DD MMM YYYY, hh:mm A');
};

export const calculateSavings = (consumption, traditionalRate, currentBill) => {
  const traditionalBill = consumption * traditionalRate;
  return Math.max(0, traditionalBill - currentBill);
};

export const calculateCarbonOffset = (solarUnits) => {
  return solarUnits * 0.8; // kg CO₂
};

export const calculateTreesEquivalent = (carbonOffset) => {
  return Math.round(carbonOffset / 20); // 1 tree = 20 kg CO₂ per year
};

export const generateBillNumber = (billId) => {
  return `EaaS-${billId.substring(0, 8).toUpperCase()}`;
};

export const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

