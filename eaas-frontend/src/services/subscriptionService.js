import api from './api.js';
import { mockPlans, mockSubscription, getRecommendedPlan } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const subscriptionService = {
  getPlans: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay for realism
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPlans;
    }
    
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data.plans;
    } catch (error) {
      console.warn('Using mock plans data');
      return mockPlans;
    }
  },

  getPlanById: async (planId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockPlans.find(p => p.plan_id === planId) || mockPlans[0];
    }
    
    try {
      const response = await api.get(`/subscriptions/plans/${planId}`);
      return response.data.plan;
    } catch (error) {
      console.warn('Using mock plan data');
      return mockPlans.find(p => p.plan_id === planId) || mockPlans[0];
    }
  },

  recommendPlan: async (monthlyBill) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        plans: mockPlans,
        ...getRecommendedPlan(monthlyBill)
      };
    }
    
    try {
      const response = await api.get('/subscriptions/plans/recommend', {
        params: { monthlyBill },
      });
      return response.data;
    } catch (error) {
      console.warn('Using mock recommendation');
      return {
        plans: mockPlans,
        ...getRecommendedPlan(monthlyBill)
      };
    }
  },

  createSubscription: async (subscriptionData) => {
    if (USE_MOCK_DATA) {
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate successful creation
      const selectedPlan = mockPlans.find(p => p.plan_id === subscriptionData.plan_id) || mockPlans[1];
      return {
        subscription: {
          ...mockSubscription,
          subscription_id: `sub_${Date.now()}`,
          plan_id: subscriptionData.plan_id,
          plan_name: selectedPlan.plan_name,
          plan_type: subscriptionData.plan_id === '1' ? 'basic_solar' : 
                    subscriptionData.plan_id === '2' ? 'solar_battery' : 'premium',
          monthly_fee: selectedPlan.monthly_fee,
          installation_capacity: selectedPlan.solar_capacity,
          battery_capacity: selectedPlan.battery_capacity,
          installation_date: new Date().toISOString().split('T')[0],
          start_date: new Date().toISOString().split('T')[0],
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date().toISOString()
        }
      };
    }
    
    try {
      const response = await api.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      console.warn('Using mock subscription creation');
      const selectedPlan = mockPlans.find(p => p.plan_id === subscriptionData.plan_id) || mockPlans[1];
      return {
        subscription: {
          ...mockSubscription,
          subscription_id: `sub_${Date.now()}`,
          plan_id: subscriptionData.plan_id,
          plan_name: selectedPlan.plan_name,
          plan_type: subscriptionData.plan_id === '1' ? 'basic_solar' : 
                    subscriptionData.plan_id === '2' ? 'solar_battery' : 'premium',
          monthly_fee: selectedPlan.monthly_fee,
          installation_capacity: selectedPlan.solar_capacity,
          battery_capacity: selectedPlan.battery_capacity
        }
      };
    }
  },

  getUserSubscriptions: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [mockSubscription];
    }
    
    try {
      const response = await api.get(`/subscriptions/user/${userId}`);
      return response.data.subscriptions;
    } catch (error) {
      console.warn('Using mock subscription data');
      return [mockSubscription];
    }
  },

  getSubscriptionById: async (subscriptionId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockSubscription;
    }
    
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response.data.subscription;
    } catch (error) {
      console.warn('Using mock subscription data');
      return mockSubscription;
    }
  },
};

