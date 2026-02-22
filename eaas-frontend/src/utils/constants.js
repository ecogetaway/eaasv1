export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';

export const PLAN_TYPES = {
  BASIC_SOLAR: 'basic_solar',
  SOLAR_BATTERY: 'solar_battery',
  PREMIUM: 'premium',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const TICKET_CATEGORY = {
  POWER_OUTAGE: 'power_outage',
  SOLAR_PERFORMANCE: 'solar_performance',
  BATTERY_ISSUE: 'battery_issue',
  BILLING_QUERY: 'billing_query',
  INSTALLATION: 'installation',
  OTHER: 'other',
};

export const TICKET_CATEGORY_LABELS = {
  power_outage: 'Power Outage',
  solar_performance: 'Solar Performance',
  battery_issue: 'Battery Issue',
  billing_query: 'Billing Query',
  installation: 'Installation',
  other: 'Other',
};

export const ESTIMATED_RESOLUTION_TIME = {
  power_outage: '4 hrs',
  solar_performance: '24 hrs',
  battery_issue: '24 hrs',
  billing_query: '2 business days',
  installation: '3 business days',
  other: '2 business days',
};

export const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

