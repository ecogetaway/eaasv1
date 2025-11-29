// Comprehensive Mock Data for Hackathon Demo
// This ensures the frontend works perfectly even if backend is unavailable

export const mockPlans = [
  {
    plan_id: '1',
    plan_name: 'Basic Solar',
    plan_type: 'basic_solar',
    monthly_fee: 799,
    setup_fee: 5000,
    solar_capacity: 2,
    battery_capacity: 0,
    estimated_savings: 1200,
    features: JSON.stringify({
      solar_capacity: '2kW',
      warranty: '25 years',
      features: ['Mobile app access', 'Basic support', 'Net metering']
    }),
    is_active: true
  },
  {
    plan_id: '2',
    plan_name: 'Solar + Battery',
    plan_type: 'solar_battery',
    monthly_fee: 1299,
    setup_fee: 8000,
    solar_capacity: 3,
    battery_capacity: 5,
    estimated_savings: 2000,
    features: JSON.stringify({
      solar_capacity: '3kW',
      battery_capacity: '5kWh',
      warranty: '25 years',
      features: ['24/7 backup power', 'Priority support', 'Mobile app access', 'Net metering']
    }),
    is_active: true
  },
  {
    plan_id: '3',
    plan_name: 'Premium',
    plan_type: 'premium',
    monthly_fee: 1999,
    setup_fee: 12000,
    solar_capacity: 5,
    battery_capacity: 10,
    estimated_savings: 3500,
    features: JSON.stringify({
      solar_capacity: '5kW',
      battery_capacity: '10kWh',
      warranty: '25 years',
      features: ['24/7 backup power', 'Premium support', 'Smart home integration', 'Energy analytics', 'Maintenance included', 'Mobile app access', 'Net metering']
    }),
    is_active: true
  }
];

export const mockSubscription = {
  subscription_id: 'sub_123',
  user_id: 'user_123',
  plan_type: 'solar_battery',
  plan_name: 'Solar + Battery',
  monthly_fee: 1299,
  installation_capacity: 3,
  battery_capacity: 5,
  meter_number: 'MTR12345678',
  installation_date: '2024-10-15',
  status: 'active',
  start_date: '2024-10-15',
  next_billing_date: '2024-12-15',
  discom_approval_status: 'approved',
  net_metering_id: 'NM123456',
  created_at: '2024-10-15T10:00:00Z'
};

export const mockBills = [
  {
    bill_id: 'bill_001',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-10-01',
    billing_period_end: '2024-10-31',
    total_consumption: 450.5,
    solar_units: 320.2,
    grid_units: 130.3,
    subscription_charge: 1299,
    energy_charge: 977.25,
    net_metering_credit: 1601.00,
    tax_amount: 121.55,
    total_amount: 1796.80,
    savings_vs_traditional: 2023.45,
    carbon_offset: 256.16,
    status: 'paid',
    due_date: '2024-11-15',
    payment_date: '2024-11-05T14:30:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-11-01T00:00:00Z'
  },
  {
    bill_id: 'bill_002',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-11-01',
    billing_period_end: '2024-11-30',
    total_consumption: 485.3,
    solar_units: 345.8,
    grid_units: 139.5,
    subscription_charge: 1299,
    energy_charge: 1046.25,
    net_metering_credit: 1729.00,
    tax_amount: 110.93,
    total_amount: 1726.18,
    savings_vs_traditional: 2397.32,
    carbon_offset: 276.64,
    status: 'pending',
    due_date: '2024-12-15',
    payment_date: null,
    invoice_url: null,
    discom_sync_status: 'pending',
    created_at: '2024-12-01T00:00:00Z'
  }
];

export const mockCurrentEnergy = {
  reading_id: 12345,
  user_id: 'user_123',
  meter_id: 'meter_123',
  timestamp: new Date().toISOString(),
  solar_generation: 2.45,
  grid_import: 0.8,
  grid_export: 1.2,
  battery_charge: 4.2,
  battery_discharge: 0.0,
  total_consumption: 2.05,
  voltage: 220.5,
  frequency: 50.0,
  power_factor: 0.95,
  device_status: {
    solar_panel: 'active',
    battery: { level: 84, status: 'operational' },
    grid: 'exporting',
    inverter: 'operational'
  }
};

export const mockEnergyHistory = (days = 7) => {
  const history = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate hourly data for the day
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      // Solar generation peaks at noon
      const solarPeak = hour >= 6 && hour <= 18;
      const solarGen = solarPeak ? (2.5 + Math.random() * 1.5) : 0;
      
      // Consumption varies by time of day
      let consumption = 1.5;
      if (hour >= 7 && hour <= 9) consumption = 2.5; // Morning peak
      if (hour >= 18 && hour <= 21) consumption = 3.0; // Evening peak
      if (hour >= 22 || hour <= 6) consumption = 0.8; // Night low
      consumption += Math.random() * 0.5;
      
      const gridImport = Math.max(0, consumption - solarGen - 1.0);
      const gridExport = Math.max(0, solarGen - consumption - 1.0);
      
      history.push({
        reading_id: history.length + 1,
        user_id: 'user_123',
        meter_id: 'meter_123',
        timestamp: timestamp.toISOString(),
        solar_generation: parseFloat(solarGen.toFixed(3)),
        grid_import: parseFloat(gridImport.toFixed(3)),
        grid_export: parseFloat(gridExport.toFixed(3)),
        battery_charge: parseFloat((3.5 + Math.random() * 1.5).toFixed(3)),
        battery_discharge: parseFloat((Math.random() * 0.5).toFixed(3)),
        total_consumption: parseFloat(consumption.toFixed(3)),
        voltage: parseFloat((220 + Math.random() * 10 - 5).toFixed(2)),
        frequency: parseFloat((50 + Math.random() * 0.4 - 0.2).toFixed(2)),
        power_factor: parseFloat((0.9 + Math.random() * 0.1).toFixed(2))
      });
    }
  }
  
  return history;
};

export const mockDashboardSummary = {
  today: {
    solar_units: 18.5,
    total_consumption: 24.3,
    savings: 45.20,
    carbon_offset: 14.8
  },
  month: {
    solar_units: 345.8,
    total_consumption: 485.3,
    savings: 2397.32,
    carbon_offset: 276.64
  }
};

export const mockMeters = [
  {
    meter_id: 'meter_123',
    user_id: 'user_123',
    meter_number: 'MTR12345678',
    device_type: 'Smart Energy Meter',
    firmware_version: 'v2.1.3',
    installation_date: '2024-10-15',
    last_sync: new Date().toISOString(),
    sync_frequency: 300,
    communication_protocol: 'MQTT',
    status: 'active',
    calibration_date: '2024-10-10'
  }
];

export const mockTickets = [
  {
    ticket_id: 'ticket_001',
    user_id: 'user_123',
    category: 'technical',
    priority: 'high',
    status: 'resolved',
    subject: 'Solar panel not generating power',
    description: 'My solar panels have stopped generating power since yesterday. Need urgent assistance.',
    assigned_to: 'Support Agent 1',
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-21T14:30:00Z',
    resolved_at: '2024-11-21T14:30:00Z'
  },
  {
    ticket_id: 'ticket_002',
    user_id: 'user_123',
    category: 'billing',
    priority: 'medium',
    status: 'in_progress',
    subject: 'Billing query - Unexpected charges',
    description: 'I noticed some unexpected charges in my last bill. Can someone explain?',
    assigned_to: 'Support Agent 2',
    created_at: '2024-11-25T09:00:00Z',
    updated_at: '2024-11-26T11:00:00Z',
    resolved_at: null
  }
];

export const mockNotifications = [
  {
    notification_id: 'notif_001',
    user_id: 'user_123',
    type: 'PUSH',
    category: 'BILLING',
    title: 'New Bill Generated',
    message: 'Your monthly bill for ₹1,726.18 is ready. Due date: Dec 15, 2024',
    status: 'SENT',
    sent_at: '2024-12-01T08:00:00Z',
    read_at: null,
    created_at: '2024-12-01T08:00:00Z'
  },
  {
    notification_id: 'notif_002',
    user_id: 'user_123',
    type: 'EMAIL',
    category: 'SAVINGS',
    title: 'Great Savings This Month!',
    message: 'You saved ₹2,397.32 compared to traditional electricity billing.',
    status: 'SENT',
    sent_at: '2024-12-01T09:00:00Z',
    read_at: '2024-12-01T10:30:00Z',
    created_at: '2024-12-01T09:00:00Z'
  }
];

export const mockAlerts = [
  {
    alert_id: 'alert_001',
    user_id: 'user_123',
    meter_id: 'meter_123',
    alert_type: 'low_generation',
    severity: 'medium',
    description: 'Solar generation is below expected levels',
    triggered_at: '2024-11-29T14:00:00Z',
    acknowledged_at: null,
    resolved_at: null,
    auto_generated: true
  }
];

export const mockDiscomStatus = {
  integration_id: 'discom_001',
  user_id: 'user_123',
  discom_name: 'BESCOM',
  consumer_number: 'CON123456789',
  net_metering_approval_status: 'approved',
  approval_date: '2024-10-20',
  agreement_number: 'AGR123456',
  sanctioned_load: 5.0,
  meter_sync_enabled: true,
  last_sync_at: new Date().toISOString(),
  sync_errors: [],
  created_at: '2024-10-15T10:00:00Z'
};

// Mock users for demo login
export const mockUsers = [
  {
    user_id: 'user_123',
    email: 'demo@eaas.com',
    password: 'demo123', // For demo only
    name: 'Demo User',
    phone: '+91 9876543210',
    address: '123 Energy Street, Bangalore, Karnataka 560001',
    role: 'customer',
    created_at: '2024-10-01T10:00:00Z'
  },
  {
    user_id: 'user_456',
    email: 'demo2@eaas.com',
    password: 'demo123',
    name: 'John Doe',
    phone: '+91 9876543211',
    address: '456 Solar Avenue, Mumbai, Maharashtra 400001',
    role: 'customer',
    created_at: '2024-10-05T10:00:00Z'
  }
];

// Helper function to get recommended plan based on monthly bill
export const getRecommendedPlan = (monthlyBill) => {
  const billAmount = parseFloat(monthlyBill) || 0;
  
  if (billAmount > 5000) {
    return { recommended: { plan_id: '3', plan_name: 'Premium' } };
  } else if (billAmount > 3000) {
    return { recommended: { plan_id: '2', plan_name: 'Solar + Battery' } };
  } else {
    return { recommended: { plan_id: '1', plan_name: 'Basic Solar' } };
  }
};

