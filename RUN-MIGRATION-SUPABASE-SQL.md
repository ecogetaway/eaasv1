# Run Migration via Supabase SQL Editor (Alternative Method)

Since Railway connection is having issues, you can run the migration directly in Supabase SQL Editor.

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

## Step 2: Run Migration SQL

Copy and paste this SQL into the editor, then click **"Run"**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  name VARCHAR(255),
  address TEXT,
  password_hash VARCHAR(255),
  fcm_token TEXT,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  plan_type VARCHAR(50),
  monthly_fee DECIMAL(10,2),
  installation_capacity DECIMAL(10,2),
  battery_capacity DECIMAL(10,2),
  meter_number VARCHAR(50),
  installation_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  start_date DATE,
  next_billing_date DATE,
  discom_approval_status VARCHAR(50),
  net_metering_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create smart_meters table
CREATE TABLE IF NOT EXISTS smart_meters (
  meter_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  meter_number VARCHAR(50) UNIQUE NOT NULL,
  device_type VARCHAR(50),
  firmware_version VARCHAR(20),
  installation_date DATE,
  last_sync TIMESTAMP,
  sync_frequency INTEGER,
  communication_protocol VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  calibration_date DATE
);
CREATE INDEX IF NOT EXISTS idx_smart_meters_user_id ON smart_meters(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_meters_meter_number ON smart_meters(meter_number);

-- Create energy_data table
CREATE TABLE IF NOT EXISTS energy_data (
  reading_id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  meter_id UUID REFERENCES smart_meters(meter_id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  solar_generation DECIMAL(10,3),
  grid_import DECIMAL(10,3),
  grid_export DECIMAL(10,3),
  battery_charge DECIMAL(10,3),
  battery_discharge DECIMAL(10,3),
  total_consumption DECIMAL(10,3),
  voltage DECIMAL(10,2),
  frequency DECIMAL(10,2),
  power_factor DECIMAL(5,2),
  device_status JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_energy_data_user_timestamp ON energy_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_energy_data_timestamp ON energy_data(timestamp DESC);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  bill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(subscription_id) ON DELETE SET NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_consumption DECIMAL(10,2),
  solar_units DECIMAL(10,2),
  grid_units DECIMAL(10,2),
  subscription_charge DECIMAL(10,2),
  energy_charge DECIMAL(10,2),
  net_metering_credit DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  savings_vs_traditional DECIMAL(10,2),
  carbon_offset DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  due_date DATE,
  payment_date TIMESTAMP,
  invoice_url TEXT,
  discom_sync_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES bills(bill_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50) DEFAULT 'razorpay',
  transaction_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT NOW(),
  failure_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  method_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  method_type VARCHAR(20) NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  subject VARCHAR(255),
  description TEXT,
  attachment_url TEXT,
  assigned_to VARCHAR(255),
  sla_deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- Create ticket_updates table
CREATE TABLE IF NOT EXISTS ticket_updates (
  update_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticket_updates_ticket_id ON ticket_updates(ticket_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  category VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  meter_id UUID REFERENCES smart_meters(meter_id) ON DELETE SET NULL,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  description TEXT,
  triggered_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  auto_generated BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);

-- Create plan_catalog table (THIS IS THE CRITICAL ONE!)
CREATE TABLE IF NOT EXISTS plan_catalog (
  plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name VARCHAR(100) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  monthly_fee DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2),
  solar_capacity DECIMAL(10,2),
  battery_capacity DECIMAL(10,2),
  estimated_savings DECIMAL(10,2),
  features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_plan_catalog_plan_type ON plan_catalog(plan_type);
CREATE INDEX IF NOT EXISTS idx_plan_catalog_is_active ON plan_catalog(is_active) WHERE is_active = true;

-- Create discom_integration table
CREATE TABLE IF NOT EXISTS discom_integration (
  integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  discom_name VARCHAR(100),
  consumer_number VARCHAR(100),
  net_metering_approval_status VARCHAR(50),
  approval_date DATE,
  agreement_number VARCHAR(100),
  sanctioned_load DECIMAL(10,2),
  meter_sync_enabled BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP,
  sync_errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_discom_integration_user_id ON discom_integration(user_id);

-- Create system_events table
CREATE TABLE IF NOT EXISTS system_events (
  event_id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20),
  source VARCHAR(100),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_events_type_created_at ON system_events(event_type, created_at DESC);
```

## Step 3: Insert Demo Plans

After tables are created, run this to add the 3 plans:

```sql
-- Insert plans (idempotent - safe to run multiple times)
INSERT INTO plan_catalog (plan_id, plan_name, plan_type, monthly_fee, setup_fee, solar_capacity, battery_capacity, estimated_savings, features, is_active)
VALUES 
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Basic Solar',
    'basic_solar',
    799,
    5000,
    2,
    0,
    1200,
    '{"solar_capacity": "2kW", "warranty": "25 years", "features": ["Mobile app access", "Basic support", "Net metering"]}'::jsonb,
    true
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Solar + Battery',
    'solar_battery',
    1299,
    8000,
    3,
    5,
    2000,
    '{"solar_capacity": "3kW", "battery_capacity": "5kWh", "warranty": "25 years", "features": ["24/7 backup power", "Priority support", "Mobile app access", "Net metering"]}'::jsonb,
    true
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Premium',
    'premium',
    1999,
    12000,
    5,
    10,
    3500,
    '{"solar_capacity": "5kW", "battery_capacity": "10kWh", "warranty": "25 years", "features": ["24/7 backup power", "Premium support", "Smart home integration", "Energy analytics", "Maintenance included", "Mobile app access", "Net metering"]}'::jsonb,
    true
  )
ON CONFLICT (plan_id) DO NOTHING;
```

## Step 4: Verify

1. Go to **"Table Editor"** in Supabase
2. You should see all tables including `plan_catalog`
3. Check `plan_catalog` has 3 rows

## Step 5: Test API

```bash
curl https://eaas-production.up.railway.app/api/subscriptions/plans
```

This should now return the 3 plans instead of an error!

