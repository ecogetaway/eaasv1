import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🔄 Starting database migration...\n');

    // Enable UUID extension
    console.log('📦 Enabling UUID extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled\n');

    // 1. Create users table
    console.log('📋 Creating users table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL');
    console.log('✅ users table created\n');

    // 2. Create subscriptions table
    console.log('📋 Creating subscriptions table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_meter_number ON subscriptions(meter_number) WHERE meter_number IS NOT NULL');
    console.log('✅ subscriptions table created\n');

    // 3. Create smart_meters table
    console.log('📋 Creating smart_meters table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_smart_meters_user_id ON smart_meters(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_smart_meters_meter_number ON smart_meters(meter_number)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_smart_meters_status ON smart_meters(status)');
    console.log('✅ smart_meters table created\n');

    // 4. Create energy_data table (TIME SERIES DATA)
    console.log('📋 Creating energy_data table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_energy_data_user_timestamp ON energy_data(user_id, timestamp DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_energy_data_meter_timestamp ON energy_data(meter_id, timestamp DESC) WHERE meter_id IS NOT NULL');
    await client.query('CREATE INDEX IF NOT EXISTS idx_energy_data_timestamp ON energy_data(timestamp DESC)');
    console.log('✅ energy_data table created\n');

    // 5. Create bills table
    console.log('📋 Creating bills table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bills_subscription_id ON bills(subscription_id) WHERE subscription_id IS NOT NULL');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bills_period ON bills(billing_period_start, billing_period_end)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date) WHERE due_date IS NOT NULL');
    console.log('✅ bills table created\n');

    // 6. Create payments table
    console.log('📋 Creating payments table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id) WHERE transaction_id IS NOT NULL');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL');
    console.log('✅ payments table created\n');

    // 7. Create payment_methods table
    console.log('📋 Creating payment_methods table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        method_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        method_type VARCHAR(20) NOT NULL,
        details JSONB NOT NULL DEFAULT '{}'::jsonb,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = true');
    console.log('✅ payment_methods table created\n');

    // 8. Create support_tickets table
    console.log('📋 Creating support_tickets table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC)');
    console.log('✅ support_tickets table created\n');

    // 9. Create ticket_updates table
    console.log('📋 Creating ticket_updates table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ticket_updates (
        update_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ticket_id UUID NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
        user_type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        attachment_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_ticket_updates_ticket_id ON ticket_updates(ticket_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_ticket_updates_created_at ON ticket_updates(ticket_id, created_at DESC)');
    console.log('✅ ticket_updates table created\n');

    // 10. Create notifications table
    console.log('📋 Creating notifications table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(user_id, created_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(user_id, read_at) WHERE read_at IS NULL');
    console.log('✅ notifications table created\n');

    // 11. Create alerts table
    console.log('📋 Creating alerts table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_meter_id ON alerts(meter_id) WHERE meter_id IS NOT NULL');
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(user_id, triggered_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(user_id, resolved_at) WHERE resolved_at IS NULL');
    console.log('✅ alerts table created\n');

    // 12. Create plan_catalog table
    console.log('📋 Creating plan_catalog table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_plan_catalog_plan_type ON plan_catalog(plan_type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_plan_catalog_is_active ON plan_catalog(is_active) WHERE is_active = true');
    console.log('✅ plan_catalog table created\n');

    // 13. Create discom_integration table
    console.log('📋 Creating discom_integration table...');
    await client.query(`
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
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_discom_integration_user_id ON discom_integration(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_discom_integration_consumer_number ON discom_integration(consumer_number) WHERE consumer_number IS NOT NULL');
    await client.query('CREATE INDEX IF NOT EXISTS idx_discom_integration_discom_name ON discom_integration(discom_name)');
    console.log('✅ discom_integration table created\n');

    // 14. Create system_events table
    console.log('📋 Creating system_events table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_events (
        event_id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        severity VARCHAR(20),
        source VARCHAR(100),
        description TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_system_events_type_created_at ON system_events(event_type, created_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_system_events_severity ON system_events(severity)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_system_events_created_at ON system_events(created_at DESC)');
    console.log('✅ system_events table created\n');

    await client.query('COMMIT');
    console.log('🎉 All tables created successfully!');
    console.log('\n📊 Migration Summary:');
    console.log('   ✅ 14 tables created');
    console.log('   ✅ All indexes created');
    console.log('   ✅ Foreign key constraints configured');
    console.log('   ✅ UUID extension enabled');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration
createTables()
  .then(() => {
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
