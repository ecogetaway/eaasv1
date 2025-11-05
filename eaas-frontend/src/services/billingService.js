import api from './api.js';

export const billingService = {
  getUserBills: async (userId) => {
    const response = await api.get(`/bills/user/${userId}`);
    return response.data.bills;
  },

  getBillById: async (billId) => {
    const response = await api.get(`/bills/${billId}`);
    return response.data.bill;
  },

  getCurrentMonthBill: async (userId) => {
    const response = await api.get(`/bills/current/${userId}`);
    return response.data.bill;
  },

  processPayment: async (billId, paymentData) => {
    const response = await api.post(`/bills/${billId}/pay`, paymentData);
    return response.data;
  },

  downloadInvoice: async (billId) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/bills/${billId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download invoice: ${response.status} ${errorText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${billId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Invoice download error:', error);
      throw error;
    }
  },
};

