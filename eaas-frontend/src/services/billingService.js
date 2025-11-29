import api from './api.js';
import { API_URL } from '../utils/constants.js';
import { mockBills } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const billingService = {
  getUserBills: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockBills;
    }
    
    try {
      const response = await api.get(`/bills/user/${userId}`);
      return response.data.bills;
    } catch (error) {
      console.warn('Using mock bills data');
      return mockBills;
    }
  },

  getBillById: async (billId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockBills.find(b => b.bill_id === billId) || mockBills[0];
    }
    
    try {
      const response = await api.get(`/bills/${billId}`);
      return response.data.bill;
    } catch (error) {
      console.warn('Using mock bill data');
      return mockBills.find(b => b.bill_id === billId) || mockBills[0];
    }
  },

  getCurrentMonthBill: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return the pending bill (most recent)
      return mockBills.find(b => b.status === 'pending') || mockBills[0];
    }
    
    try {
      const response = await api.get(`/bills/current/${userId}`);
      return response.data.bill;
    } catch (error) {
      console.warn('Using mock current bill');
      return mockBills.find(b => b.status === 'pending') || mockBills[0];
    }
  },

  processPayment: async (billId, paymentData) => {
    if (USE_MOCK_DATA) {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update bill status in mock data
      const bill = mockBills.find(b => b.bill_id === billId);
      if (bill) {
        bill.status = 'paid';
        bill.payment_date = new Date().toISOString();
      }
      return {
        success: true,
        payment: {
          payment_id: `pay_${Date.now()}`,
          bill_id: billId,
          amount: paymentData.amount,
          status: 'success',
          payment_date: new Date().toISOString(),
          method: paymentData.method || 'card'
        }
      };
    }
    
    try {
      const response = await api.post(`/bills/${billId}/pay`, paymentData);
      return response.data;
    } catch (error) {
      console.warn('Using mock payment processing');
      return {
        success: true,
        payment: {
          payment_id: `pay_${Date.now()}`,
          bill_id: billId,
          amount: paymentData.amount,
          status: 'success',
          payment_date: new Date().toISOString()
        }
      };
    }
  },

  downloadInvoice: async (billId) => {
    if (USE_MOCK_DATA) {
      // For demo: Create a simple text-based invoice
      await new Promise(resolve => setTimeout(resolve, 500));
      const bill = mockBills.find(b => b.bill_id === billId) || mockBills[0];
      
      // Create a simple invoice text
      const invoiceText = `
ENERGY AS A SERVICE - INVOICE
==============================

Bill ID: ${bill.bill_id}
Billing Period: ${bill.billing_period_start} to ${bill.billing_period_end}

ENERGY DETAILS:
- Total Consumption: ${bill.total_consumption} kWh
- Solar Generation: ${bill.solar_units} kWh
- Grid Import: ${bill.grid_units} kWh

CHARGES:
- Subscription Fee: ₹${bill.subscription_charge.toFixed(2)}
- Energy Charge: ₹${bill.energy_charge.toFixed(2)}
- Net Metering Credit: -₹${bill.net_metering_credit.toFixed(2)}
- Tax: ₹${bill.tax_amount.toFixed(2)}

TOTAL AMOUNT: ₹${bill.total_amount.toFixed(2)}
Savings vs Traditional: ₹${bill.savings_vs_traditional.toFixed(2)}
Carbon Offset: ${bill.carbon_offset.toFixed(2)} kg CO2

Status: ${bill.status.toUpperCase()}
${bill.payment_date ? `Paid on: ${new Date(bill.payment_date).toLocaleDateString()}` : `Due Date: ${new Date(bill.due_date).toLocaleDateString()}`}

Thank you for choosing EaaS!
      `.trim();
      
      // Create and download as text file (simulating PDF)
      const blob = new Blob([invoiceText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${billId.substring(0, 8)}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    }
    
    try {
      const token = localStorage.getItem('token');
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

