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
    bill_id: 'bill_006',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-11-01',
    billing_period_end: '2024-11-30',
    total_consumption: 485.3,
    solar_units: 345.8,
    grid_units: 139.5,
    export_units: 62.4,
    subscription_charge: 1799,
    energy_charge: 976.50,
    net_metering_credit: 374.40,
    tax_amount: 242.66,
    total_amount: 1726.18,
    savings_vs_traditional: 2397.32,
    carbon_offset: 276.64,
    status: 'pending',
    due_date: '2024-12-15',
    payment_date: null,
    invoice_url: null,
    discom_sync_status: 'pending',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    bill_id: 'bill_005',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-10-01',
    billing_period_end: '2024-10-31',
    total_consumption: 462.8,
    solar_units: 332.5,
    grid_units: 130.3,
    export_units: 58.2,
    subscription_charge: 1799,
    energy_charge: 912.10,
    net_metering_credit: 349.20,
    tax_amount: 236.30,
    total_amount: 1882.45,
    savings_vs_traditional: 2112.30,
    carbon_offset: 263.80,
    status: 'paid',
    due_date: '2024-11-15',
    payment_date: '2024-11-08T11:20:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-11-01T00:00:00Z'
  },
  {
    bill_id: 'bill_004',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-09-01',
    billing_period_end: '2024-09-30',
    total_consumption: 498.6,
    solar_units: 368.2,
    grid_units: 130.4,
    export_units: 74.1,
    subscription_charge: 1799,
    energy_charge: 912.80,
    net_metering_credit: 444.60,
    tax_amount: 239.54,
    total_amount: 1934.60,
    savings_vs_traditional: 2283.45,
    carbon_offset: 284.10,
    status: 'paid',
    due_date: '2024-10-15',
    payment_date: '2024-10-07T09:45:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-10-01T00:00:00Z'
  },
  {
    bill_id: 'bill_003',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-08-01',
    billing_period_end: '2024-08-31',
    total_consumption: 521.4,
    solar_units: 390.5,
    grid_units: 130.9,
    export_units: 82.6,
    subscription_charge: 1799,
    energy_charge: 916.30,
    net_metering_credit: 495.60,
    tax_amount: 243.59,
    total_amount: 2147.20,
    savings_vs_traditional: 2356.80,
    carbon_offset: 297.20,
    status: 'paid',
    due_date: '2024-09-15',
    payment_date: '2024-09-10T16:30:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-09-01T00:00:00Z'
  },
  {
    bill_id: 'bill_002',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-07-01',
    billing_period_end: '2024-07-31',
    total_consumption: 508.2,
    solar_units: 378.6,
    grid_units: 129.6,
    export_units: 78.3,
    subscription_charge: 1799,
    energy_charge: 907.20,
    net_metering_credit: 469.80,
    tax_amount: 241.88,
    total_amount: 2089.75,
    savings_vs_traditional: 2198.60,
    carbon_offset: 289.55,
    status: 'paid',
    due_date: '2024-08-15',
    payment_date: '2024-08-09T13:15:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-08-01T00:00:00Z'
  },
  {
    bill_id: 'bill_001',
    user_id: 'user_123',
    subscription_id: 'sub_123',
    billing_period_start: '2024-06-01',
    billing_period_end: '2024-06-30',
    total_consumption: 441.7,
    solar_units: 308.4,
    grid_units: 133.3,
    export_units: 52.8,
    subscription_charge: 1799,
    energy_charge: 933.10,
    net_metering_credit: 316.80,
    tax_amount: 233.97,
    total_amount: 1843.90,
    savings_vs_traditional: 1876.45,
    carbon_offset: 251.77,
    status: 'paid',
    due_date: '2024-07-15',
    payment_date: '2024-07-11T10:05:00Z',
    invoice_url: null,
    discom_sync_status: 'synced',
    created_at: '2024-07-01T00:00:00Z'
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

// DISCOM Status Stages (6-step real-world process)
export const DISCOM_STATUSES = [
  'submitted',                    // Step 1: Application submitted
  'document_verification',        // Step 1: Documents being verified
  'feasibility_study',           // Step 2: Feasibility study in progress
  'site_inspection_scheduled',   // Step 2: Site inspection scheduled
  'site_inspection_completed',    // Step 2: Site inspection done
  'technical_approval',          // Step 2: Technical approval issued
  'system_installation',          // Step 3: Solar system installation
  'inspection_documentation',    // Step 4: Inspection and documentation
  'meter_installation',           // Step 5: Net meter installation
  'grid_sync_pending',            // Step 5: Grid sync pending
  'grid_synchronized',            // Step 5: Grid synchronized
  'commissioning_complete',       // Step 6: Commissioning complete
  'grid_connected'                // Final: Fully connected and operational
];

// Required Documents for Net Metering Application
export const REQUIRED_DOCUMENTS = [
  {
    id: 'identity_proof',
    name: 'Identity Proof',
    description: 'Aadhaar, PAN, or Driving License',
    required: true
  },
  {
    id: 'property_ownership',
    name: 'Property Ownership Proof',
    description: 'Sale Deed, Property Tax Receipt, or NOC (for tenants)',
    required: true
  },
  {
    id: 'electricity_bill',
    name: 'Latest Electricity Bill',
    description: 'Most recent electricity bill from DISCOM',
    required: true
  },
  {
    id: 'site_plan',
    name: 'Site Plan/Sketch',
    description: 'Optional: Site layout sketch',
    required: false
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

// Enhanced DISCOM Application Mock Data
export const mockDiscomApplication = {
  application_id: 'app_001',
  application_number: 'DISCOM-2024-001234',
  user_id: 'user_123',
  discom_name: 'BESCOM',
  consumer_number: 'CON123456789',
  status: 'grid_connected',
  submitted_at: '2024-10-15T10:00:00Z',
  approved_at: '2024-11-20T14:30:00Z',
  agreement_number: 'AGR123456',
  sanctioned_load: 5.0,
  solar_capacity_kw: 3.0,
  property_type: 'residential',
  property_address: '123 Energy Street, Bangalore, Karnataka 560001',
  electricity_provider: 'BESCOM',
  installation_type: 'rooftop',
  roof_area_sqft: 500,
  created_at: '2024-10-15T10:00:00Z',
  
  // Documents
  documents: [
    {
      id: 'identity_proof',
      name: 'Identity Proof',
      status: 'verified',
      uploaded_at: '2024-10-15T10:30:00Z',
      verified_at: '2024-10-16T09:00:00Z'
    },
    {
      id: 'property_ownership',
      name: 'Property Ownership Proof',
      status: 'verified',
      uploaded_at: '2024-10-15T10:35:00Z',
      verified_at: '2024-10-16T09:15:00Z'
    },
    {
      id: 'electricity_bill',
      name: 'Latest Electricity Bill',
      status: 'verified',
      uploaded_at: '2024-10-15T10:40:00Z',
      verified_at: '2024-10-16T09:30:00Z'
    },
    {
      id: 'site_plan',
      name: 'Site Plan/Sketch',
      status: 'uploaded',
      uploaded_at: '2024-10-15T11:00:00Z',
      verified_at: null
    }
  ],
  
  // Feasibility Study & Technical Approval
  feasibility_study: {
    status: 'approved',
    conducted_at: '2024-10-18T10:00:00Z',
    grid_capacity_available: true,
    grid_capacity_kw: 10.0,
    transformer_capacity_kw: 25.0,
    proposed_solar_capacity_kw: 3.0,
    capacity_utilization_percent: 12.0,
    remarks: 'Grid capacity sufficient for proposed solar system'
  },
  
  technical_approval: {
    status: 'approved',
    approval_letter_number: 'TA-BESCOM-2024-001234',
    approval_date: '2024-10-25T14:00:00Z',
    approved_by: 'DISCOM Technical Team',
    validity_period_days: 180,
    conditions: [
      'System must comply with CEA and BIS standards',
      'Anti-islanding protection must be installed',
      'Bi-directional meter will be installed by DISCOM'
    ]
  },
  
  // System Installation
  system_installation: {
    status: 'completed',
    installation_date: '2024-11-05T09:00:00Z',
    installer_name: 'SolarTech Installations',
    installer_license: 'INST-LIC-2024-5678',
    equipment_compliance: {
      cea_compliant: true,
      bis_compliant: true,
      inverter_brand: 'SolarEdge',
      inverter_model: 'SE5000',
      panel_brand: 'Adani Solar',
      panel_capacity_w: 300
    },
    installation_certificate_number: 'INST-CERT-2024-001234'
  },
  
  // Inspection and Documentation
  inspection_documentation: {
    status: 'completed',
    inspection_date: '2024-11-10T10:00:00Z',
    inspected_by: 'DISCOM Inspection Team',
    electrical_test_results: {
      voltage_alignment: '220V ± 5%',
      frequency_alignment: '50Hz ± 0.5Hz',
      power_factor: '0.95+',
      insulation_resistance: 'Pass',
      earth_resistance: 'Pass',
      test_certificate_number: 'TEST-CERT-2024-001234'
    },
    commissioning_certificate: {
      certificate_number: 'COMM-CERT-2024-001234',
      issued_date: '2024-11-12T10:00:00Z',
      issued_by: 'DISCOM Commissioning Authority'
    }
  },
  
  // Grid Synchronization
  grid_sync: {
    status: 'synchronized',
    meter_number: 'BI-MTR-2024-001234',
    meter_type: 'Bi-directional Smart Meter',
    installation_date: '2024-11-15T09:00:00Z',
    synchronized_at: '2024-11-15T11:30:00Z',
    anti_islanding_protection: {
      status: 'active',
      tested: true,
      test_date: '2024-11-15T10:00:00Z',
      compliance: 'CEA Compliant'
    },
    voltage_frequency_alignment: {
      voltage: '220.5V',
      frequency: '50.0Hz',
      status: 'aligned',
      last_check: new Date().toISOString()
    },
    export_enabled: true,
    last_sync_at: new Date().toISOString()
  },
  
  // Commissioning
  commissioning: {
    status: 'complete',
    commissioning_date: '2024-11-20T14:00:00Z',
    commissioning_report_number: 'COMM-RPT-2024-001234',
    meter_sealing_status: 'sealed',
    meter_sealed_by: 'DISCOM Metering Team',
    meter_sealed_at: '2024-11-20T14:30:00Z',
    billing_cycle_start: '2024-11-21T00:00:00Z',
    net_metering_active: true
  }
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

