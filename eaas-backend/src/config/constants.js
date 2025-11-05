// Energy rates (₹ per kWh)
export const ENERGY_RATES = {
  GRID_IMPORT: 7.5,      // Cost per unit imported from grid
  GRID_EXPORT: 5.0,      // Credit per unit exported to grid
  TRADITIONAL_RATE: 8.5, // Traditional utility rate for comparison
};

// Carbon offset calculation (kg CO₂ per kWh)
export const CARBON_FACTOR = 0.8; // kg CO₂ per kWh solar generated

// Trees equivalent (1 tree = 20 kg CO₂ per year)
export const CO2_PER_TREE_YEAR = 20;

// IoT Simulator Settings
export const SIMULATOR_CONFIG = {
  UPDATE_INTERVAL: 5000, // 5 seconds
  SOLAR_PEAK_HOUR: 13,   // Peak solar generation at 1 PM
  CONSUMPTION_PEAK_MORNING: 8, // Morning peak at 8 AM
  CONSUMPTION_PEAK_EVENING: 19, // Evening peak at 7 PM
  VARIATION_PERCENT: 0.1, // ±10% random variation
};

// Subscription Plan Types
export const PLAN_TYPES = {
  BASIC_SOLAR: 'basic_solar',
  SOLAR_BATTERY: 'solar_battery',
  PREMIUM: 'premium',
};

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
};

// Bill Status
export const BILL_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Ticket Status
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Ticket Priority
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Ticket Category
export const TICKET_CATEGORY = {
  TECHNICAL: 'technical',
  BILLING: 'billing',
  INSTALLATION: 'installation',
  GENERAL: 'general',
};

// Payment Methods
export const PAYMENT_METHODS = {
  UPI: 'upi',
  CARD: 'card',
  NET_BANKING: 'net_banking',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

