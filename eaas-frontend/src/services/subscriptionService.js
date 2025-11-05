import api from './api.js';

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data.plans;
  },

  getPlanById: async (planId) => {
    const response = await api.get(`/subscriptions/plans/${planId}`);
    return response.data.plan;
  },

  recommendPlan: async (monthlyBill) => {
    const response = await api.get('/subscriptions/plans/recommend', {
      params: { monthlyBill },
    });
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  getUserSubscriptions: async (userId) => {
    const response = await api.get(`/subscriptions/user/${userId}`);
    return response.data.subscriptions;
  },

  getSubscriptionById: async (subscriptionId) => {
    const response = await api.get(`/subscriptions/${subscriptionId}`);
    return response.data.subscription;
  },
};

