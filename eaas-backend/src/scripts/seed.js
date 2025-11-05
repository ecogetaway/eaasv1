import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

// Helper function to check if data exists
const checkIfExists = async (client, table, column, value) => {
  const result = await client.query(
    `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1`,
    [value]
  );
  return parseInt(result.rows[0].count) > 0;
};

// Generate realistic energy data with all required fields
const generateEnergyData = async (client, userId, meterId, subscription, days = 30) => {
  const readings = [];
  const startDate = moment().subtract(days, 'days').startOf('day');
  const solarCapacity = parseFloat(subscription.installation_capacity);
  const batteryCapacity = parseFloat(subscription.battery_capacity || 0);
  let currentBatteryLevel = 0; // Track battery state across readings

  for (let day = 0; day < days; day++) {
    const currentDate = moment(startDate).add(day, 'days');
    
    // Generate hourly data (24 hours)
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = moment(currentDate).add(hour, 'hours');
      
      // Solar generation follows sun curve (0 at night, peaks at noon)
      let solarGeneration = 0;
      if (hour >= 6 && hour <= 18) {
        const peakHour = 12; // Peak at noon
        const distanceFromPeak = Math.abs(hour - peakHour);
        const maxIntensity = Math.max(0, 1 - (distanceFromPeak / 6));
        solarGeneration = solarCapacity * maxIntensity * (0.7 + Math.random() * 0.3);
      }

      // Consumption peaks at morning (7-9 AM) and evening (6-9 PM)
      let baseConsumption = solarCapacity * 0.25; // Base consumption
      if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 21)) {
        baseConsumption = solarCapacity * 0.7; // Peak consumption
      } else if (hour >= 22 || hour <= 6) {
        baseConsumption = solarCapacity * 0.15; // Low consumption at night
      }
      const consumption = baseConsumption * (0.85 + Math.random() * 0.3);

      // Calculate grid import/export and battery behavior
      let gridImport = 0;
      let gridExport = 0;
      let batteryCharge = 0;
      let batteryDischarge = 0;

      if (solarGeneration > consumption) {
        const excess = solarGeneration - consumption;
        if (batteryCapacity > 0 && currentBatteryLevel < batteryCapacity * 0.9) {
          // Charge battery first (max 90% capacity)
          const maxChargeRate = batteryCapacity * 0.2; // Can charge 20% per hour
          batteryCharge = Math.min(excess, maxChargeRate, (batteryCapacity * 0.9) - currentBatteryLevel);
          currentBatteryLevel = Math.min(batteryCapacity * 0.9, currentBatteryLevel + batteryCharge);
          
          // Export remaining excess
          gridExport = excess - batteryCharge;
        } else {
          gridExport = excess;
        }
      } else {
        const deficit = consumption - solarGeneration;
        
        if (batteryCapacity > 0 && currentBatteryLevel > batteryCapacity * 0.1) {
          // Discharge battery (don't go below 10%)
          const maxDischargeRate = batteryCapacity * 0.15; // Can discharge 15% per hour
          batteryDischarge = Math.min(deficit, maxDischargeRate, currentBatteryLevel - (batteryCapacity * 0.1));
          currentBatteryLevel = Math.max(batteryCapacity * 0.1, currentBatteryLevel - batteryDischarge);
          gridImport = deficit - batteryDischarge;
        } else {
          gridImport = deficit;
        }
      }

      // Generate realistic voltage, frequency, and power factor
      const voltage = 220 + (Math.random() * 20 - 10); // 210-230V
      const frequency = 50 + (Math.random() * 0.4 - 0.2); // 49.8-50.2 Hz
      const powerFactor = 0.85 + (Math.random() * 0.15); // 0.85-1.0

      // Device status JSONB
      const deviceStatus = {
        solar_panel: solarGeneration > 0 ? 'active' : 'idle',
        battery: batteryCapacity > 0 ? {
          level: parseFloat((currentBatteryLevel / batteryCapacity * 100).toFixed(1)),
          status: currentBatteryLevel > batteryCapacity * 0.2 ? 'operational' : 'low'
        } : null,
        grid: gridImport > 0 ? 'importing' : gridExport > 0 ? 'exporting' : 'idle',
        inverter: 'operational'
      };

      readings.push({
        user_id: userId,
        meter_id: meterId,
        timestamp: timestamp.toISOString(),
        solar_generation: parseFloat(solarGeneration.toFixed(3)),
        grid_import: parseFloat(gridImport.toFixed(3)),
        grid_export: parseFloat(gridExport.toFixed(3)),
        battery_charge: parseFloat(currentBatteryLevel.toFixed(3)),
        battery_discharge: parseFloat(batteryDischarge.toFixed(3)),
        total_consumption: parseFloat(consumption.toFixed(3)),
        voltage: parseFloat(voltage.toFixed(2)),
        frequency: parseFloat(frequency.toFixed(2)),
        power_factor: parseFloat(powerFactor.toFixed(2)),
        device_status: JSON.stringify(deviceStatus)
      });
    }
  }

  return readings;
};

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🔄 Starting database seeding...\n');

    // 1. Insert plans in plan_catalog (idempotent)
    console.log('📋 Step 1: Creating plans...');
    const plans = [
      {
        plan_name: 'Basic Solar',
        plan_type: 'basic_solar',
        monthly_fee: 799,
        setup_fee: 5000,
        solar_capacity: 2,
        battery_capacity: 0,
        estimated_savings: 1200,
        features: {
          solar_capacity: '2kW',
          warranty: '25 years',
          features: ['Mobile app access', 'Basic support', 'Net metering']
        }
      },
      {
        plan_name: 'Solar + Battery',
        plan_type: 'solar_battery',
        monthly_fee: 1299,
        setup_fee: 8000,
        solar_capacity: 3,
        battery_capacity: 5,
        estimated_savings: 2000,
        features: {
          solar_capacity: '3kW',
          battery_capacity: '5kWh',
          warranty: '25 years',
          features: ['24/7 backup power', 'Priority support', 'Mobile app access', 'Net metering']
        }
      },
      {
        plan_name: 'Premium',
        plan_type: 'premium',
        monthly_fee: 1999,
        setup_fee: 12000,
        solar_capacity: 5,
        battery_capacity: 10,
        estimated_savings: 3500,
        features: {
          solar_capacity: '5kW',
          battery_capacity: '10kWh',
          warranty: '25 years',
          features: ['24/7 backup power', 'Premium support', 'Smart home integration', 'Energy analytics', 'Maintenance included', 'Mobile app access', 'Net metering']
        }
      }
    ];

    const planIds = [];
    for (const plan of plans) {
      const existingPlan = await client.query(
        'SELECT plan_id FROM plan_catalog WHERE plan_type = $1',
        [plan.plan_type]
      );

      if (existingPlan.rows.length > 0) {
        console.log(`  ⏭️  Plan "${plan.plan_name}" already exists, skipping...`);
        planIds.push(existingPlan.rows[0].plan_id);
      } else {
        const planId = uuidv4();
        await client.query(
          `INSERT INTO plan_catalog (plan_id, plan_name, plan_type, monthly_fee, setup_fee, solar_capacity, battery_capacity, estimated_savings, features, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [planId, plan.plan_name, plan.plan_type, plan.monthly_fee, plan.setup_fee, plan.solar_capacity, plan.battery_capacity, plan.estimated_savings, JSON.stringify(plan.features), true]
        );
        planIds.push(planId);
        console.log(`  ✅ Created plan: ${plan.plan_name}`);
      }
    }
    console.log('');

    // 2. Create demo users (idempotent)
    console.log('👥 Step 2: Creating demo users...');
    const users = [
      { email: 'demo1@eaas.com', name: 'Rajesh Kumar', phone: '+91 9876543210', address: '123 MG Road, Bangalore, Karnataka 560001' },
      { email: 'demo2@eaas.com', name: 'Priya Sharma', phone: '+91 9876543211', address: '456 Koramangala, Bangalore, Karnataka 560095' },
      { email: 'demo3@eaas.com', name: 'Amit Patel', phone: '+91 9876543212', address: '789 Indiranagar, Bangalore, Karnataka 560038' },
      { email: 'demo4@eaas.com', name: 'Sneha Reddy', phone: '+91 9876543213', address: '321 Whitefield, Bangalore, Karnataka 560066' },
      { email: 'demo5@eaas.com', name: 'Vikram Singh', phone: '+91 9876543214', address: '654 HSR Layout, Bangalore, Karnataka 560102' },
    ];

    const passwordHash = await bcrypt.hash('Demo@123', 10);
    const userIds = [];

    for (const user of users) {
      const existingUser = await checkIfExists(client, 'users', 'email', user.email);
      
      if (existingUser) {
        const result = await client.query('SELECT user_id FROM users WHERE email = $1', [user.email]);
        userIds.push({ userId: result.rows[0].user_id, ...user });
        console.log(`  ⏭️  User ${user.email} already exists, skipping...`);
      } else {
        const userId = uuidv4();
        await client.query(
          `INSERT INTO users (user_id, email, phone, name, address, password_hash, notification_preferences)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [userId, user.email, user.phone, user.name, user.address, passwordHash, JSON.stringify({ email: true, sms: true, push: true })]
        );
        userIds.push({ userId, ...user });
        console.log(`  ✅ Created user: ${user.email}`);
      }
    }
    console.log('');

    // 3. Create subscriptions (idempotent)
    console.log('📦 Step 3: Creating subscriptions...');
    const subscriptionTypes = ['basic_solar', 'premium', 'basic_solar', 'solar_battery', 'solar_battery'];
    const subscriptionIds = [];

    for (let i = 0; i < userIds.length; i++) {
      const user = userIds[i];
      const planType = subscriptionTypes[i];
      const planIndex = plans.findIndex(p => p.plan_type === planType);
      const plan = plans[planIndex];
      const planId = planIds[planIndex];

      const existingSub = await client.query(
        'SELECT subscription_id FROM subscriptions WHERE user_id = $1',
        [user.userId]
      );

      if (existingSub.rows.length > 0) {
        console.log(`  ⏭️  Subscription for ${user.email} already exists, skipping...`);
        subscriptionIds.push({ subscriptionId: existingSub.rows[0].subscription_id, userId: user.userId, planType, plan });
      } else {
        const subscriptionId = uuidv4();
        const startDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
        const installationDate = moment().subtract(85, 'days').format('YYYY-MM-DD');
        const nextBillingDate = moment().add(10, 'days').format('YYYY-MM-DD');
        const meterNumber = `MTR${user.userId.substring(0, 8).toUpperCase()}`;

        await client.query(
          `INSERT INTO subscriptions (subscription_id, user_id, plan_type, monthly_fee, installation_capacity, battery_capacity, meter_number, installation_date, status, start_date, next_billing_date, discom_approval_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [subscriptionId, user.userId, planType, plan.monthly_fee, plan.solar_capacity, plan.battery_capacity, meterNumber, installationDate, 'active', startDate, nextBillingDate, 'approved']
        );
        subscriptionIds.push({ subscriptionId, userId: user.userId, planType, plan, meterNumber });
        console.log(`  ✅ Created subscription for ${user.email} (${plan.plan_name})`);
      }
    }
    console.log('');

    // 4. Create smart meters (idempotent)
    console.log('🔌 Step 4: Creating smart meters...');
    const meterIds = [];

    for (let i = 0; i < subscriptionIds.length; i++) {
      const sub = subscriptionIds[i];
      const user = userIds[i];

      const existingMeter = await client.query(
        'SELECT meter_id FROM smart_meters WHERE user_id = $1',
        [user.userId]
      );

      if (existingMeter.rows.length > 0) {
        console.log(`  ⏭️  Smart meter for ${user.email} already exists, skipping...`);
        meterIds.push({ meterId: existingMeter.rows[0].meter_id, userId: user.userId, subscription: sub });
      } else {
        const meterId = uuidv4();
        const installationDate = moment().subtract(85, 'days').format('YYYY-MM-DD');
        const calibrationDate = moment().subtract(80, 'days').format('YYYY-MM-DD');

        await client.query(
          `INSERT INTO smart_meters (meter_id, user_id, meter_number, device_type, firmware_version, installation_date, last_sync, sync_frequency, communication_protocol, status, calibration_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [meterId, user.userId, sub.meterNumber || `MTR${user.userId.substring(0, 8).toUpperCase()}`, 'Smart Energy Meter', 'v2.1.3', installationDate, moment().toISOString(), 300, 'MQTT', 'active', calibrationDate]
        );
        meterIds.push({ meterId, userId: user.userId, subscription: sub });
        console.log(`  ✅ Created smart meter for ${user.email}`);
      }
    }
    console.log('');

    // 5. Generate energy data (check if exists first)
    console.log('⚡ Step 5: Generating energy data (30 days, hourly readings)...');
    for (let i = 0; i < meterIds.length; i++) {
      const meter = meterIds[i];
      const user = userIds[i];

      // Check if data exists for this user
      const existingData = await client.query(
        'SELECT COUNT(*) as count FROM energy_data WHERE user_id = $1',
        [user.userId]
      );

      if (parseInt(existingData.rows[0].count) > 0) {
        console.log(`  ⏭️  Energy data for ${user.email} already exists (${existingData.rows[0].count} readings), skipping...`);
        continue;
      }

      const energyReadings = await generateEnergyData(
        client,
        user.userId,
        meter.meterId,
        meter.subscription.plan,
        30
      );

      // Insert in batches for performance
      const batchSize = 100;
      for (let j = 0; j < energyReadings.length; j += batchSize) {
        const batch = energyReadings.slice(j, j + batchSize);
        
        // Build parameterized query for batch insert
        const placeholders = [];
        const params = [];
        let paramIndex = 1;

        for (const r of batch) {
          placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6}, $${paramIndex + 7}, $${paramIndex + 8}, $${paramIndex + 9}, $${paramIndex + 10}, $${paramIndex + 11}, $${paramIndex + 12})`);
          params.push(
            r.user_id, r.meter_id, r.timestamp, r.solar_generation, r.grid_import, r.grid_export,
            r.battery_charge, r.battery_discharge, r.total_consumption, r.voltage, r.frequency, r.power_factor, r.device_status
          );
          paramIndex += 13;
        }

        await client.query(
          `INSERT INTO energy_data (user_id, meter_id, timestamp, solar_generation, grid_import, grid_export, battery_charge, battery_discharge, total_consumption, voltage, frequency, power_factor, device_status)
           VALUES ${placeholders.join(', ')}`,
          params
        );
      }

      console.log(`  ✅ Generated ${energyReadings.length} energy readings for ${user.email}`);
    }
    console.log('');

    // 6. Generate bills (2 per user - one paid, one pending)
    console.log('💰 Step 6: Creating bills (2 per user)...');
    for (let i = 0; i < userIds.length; i++) {
      const user = userIds[i];
      const sub = subscriptionIds[i];

      // Check existing bills
      const existingBills = await client.query(
        'SELECT COUNT(*) as count FROM bills WHERE user_id = $1',
        [user.userId]
      );

      if (parseInt(existingBills.rows[0].count) >= 2) {
        console.log(`  ⏭️  Bills for ${user.email} already exist, skipping...`);
        continue;
      }

      // Create 2 bills - previous 2 months
      for (let monthOffset = 2; monthOffset >= 1; monthOffset--) {
        const periodStart = moment().subtract(monthOffset, 'months').startOf('month');
        const periodEnd = moment(periodStart).endOf('month');
        const dueDate = moment(periodEnd).add(15, 'days').format('YYYY-MM-DD');
        const isPaid = monthOffset === 2; // Older bill (2 months ago) is paid, recent one (1 month ago) is pending

        // Calculate aggregated energy data for the period
        const energyResult = await client.query(
          `SELECT 
            SUM(total_consumption) as total_consumption,
            SUM(solar_generation) as solar_units,
            SUM(grid_import) as grid_units,
            SUM(grid_export) as export_units
           FROM energy_data
           WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3`,
          [user.userId, periodStart.toISOString(), periodEnd.toISOString()]
        );

        const energy = energyResult.rows[0];
        const totalConsumption = parseFloat(energy.total_consumption || 0) / 1000; // Convert to kWh
        const solarUnits = parseFloat(energy.solar_units || 0) / 1000;
        const gridUnits = parseFloat(energy.grid_units || 0) / 1000;
        const exportUnits = parseFloat(energy.export_units || 0) / 1000;

        // Calculate bill amounts
        const subscriptionCharge = sub.plan.monthly_fee;
        const energyCharge = gridUnits * 7.5; // ₹7.5 per kWh
        const netMeteringCredit = exportUnits * 5.0; // ₹5.0 per kWh exported
        const taxAmount = (subscriptionCharge + energyCharge - netMeteringCredit) * 0.18; // 18% GST
        const totalAmount = subscriptionCharge + energyCharge - netMeteringCredit + taxAmount;
        
        const traditionalBill = totalConsumption * 8.5; // Traditional rate
        const savings = Math.max(0, traditionalBill - totalAmount);
        const carbonOffset = solarUnits * 0.8; // kg CO2 per kWh

        const billId = uuidv4();
        const status = isPaid ? 'paid' : 'pending';
        const paymentDate = isPaid ? moment(periodEnd).add(2, 'days').toISOString() : null;

        await client.query(
          `INSERT INTO bills (bill_id, user_id, subscription_id, billing_period_start, billing_period_end, total_consumption, solar_units, grid_units, subscription_charge, energy_charge, net_metering_credit, tax_amount, total_amount, savings_vs_traditional, carbon_offset, status, due_date, payment_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [billId, user.userId, sub.subscriptionId, periodStart.format('YYYY-MM-DD'), periodEnd.format('YYYY-MM-DD'), 
           totalConsumption, solarUnits, gridUnits, subscriptionCharge, energyCharge, netMeteringCredit, taxAmount, 
           totalAmount, savings, carbonOffset, status, dueDate, paymentDate]
        );

        // Create payment record for paid bills
        if (isPaid) {
          const paymentId = uuidv4();
          await client.query(
            `INSERT INTO payments (payment_id, bill_id, user_id, amount, payment_method, payment_gateway, transaction_id, razorpay_order_id, razorpay_payment_id, status, payment_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [paymentId, billId, user.userId, totalAmount, 'UPI', 'razorpay', `TXN${Date.now()}${i}`, `order_${billId.substring(0, 10)}`, `pay_${billId.substring(0, 10)}`, 'success', paymentDate]
          );
        }

        console.log(`  ✅ Created ${status} bill for ${user.email} (${periodStart.format('MMM YYYY')}) - ₹${totalAmount.toFixed(2)}`);
      }
    }
    console.log('');

    // 7. Create support tickets (2-3 per user)
    console.log('🎫 Step 7: Creating support tickets...');
    const ticketTemplates = [
      { category: 'technical', priority: 'high', status: 'resolved', subject: 'Solar panel not generating power', description: 'My solar panels have stopped generating power since yesterday. Need urgent assistance.' },
      { category: 'billing', priority: 'medium', status: 'in_progress', subject: 'Billing query - Unexpected charges', description: 'I noticed some unexpected charges in my last bill. Can someone explain?' },
      { category: 'general', priority: 'low', status: 'open', subject: 'Appreciation for service', description: 'Just wanted to thank the team for excellent service and savings!' },
      { category: 'installation', priority: 'high', status: 'open', subject: 'Battery installation scheduled', description: 'When can I schedule the battery installation?' },
      { category: 'technical', priority: 'critical', status: 'in_progress', subject: 'Battery backup not working', description: 'Power went out but battery backup did not activate. This is urgent!' },
      { category: 'billing', priority: 'low', status: 'resolved', subject: 'Payment confirmation', description: 'I paid my bill but haven\'t received confirmation email.' },
      { category: 'technical', priority: 'medium', status: 'resolved', subject: 'App showing incorrect data', description: 'The mobile app is showing incorrect energy consumption data.' },
      { category: 'general', priority: 'low', status: 'open', subject: 'Request for additional information', description: 'Can I get more details about upgrading my plan?' },
    ];

    let ticketIndex = 0;
    for (let i = 0; i < userIds.length; i++) {
      const user = userIds[i];
      const ticketsForUser = Math.floor(Math.random() * 2) + 2; // 2-3 tickets per user

      for (let j = 0; j < ticketsForUser; j++) {
        const template = ticketTemplates[ticketIndex % ticketTemplates.length];
        ticketIndex++;

        const ticketId = uuidv4();
        const createdAt = moment().subtract(Math.floor(Math.random() * 30) + 1, 'days').toISOString();
        const updatedAt = template.status !== 'open' ? moment(createdAt).add(Math.floor(Math.random() * 5) + 1, 'days').toISOString() : createdAt;
        const resolvedAt = template.status === 'resolved' ? updatedAt : null;
        const assignedTo = template.status !== 'open' ? `Support Agent ${(i % 3) + 1}` : null;
        const slaDeadline = moment(createdAt).add(template.priority === 'critical' ? 4 : template.priority === 'high' ? 8 : 24, 'hours').toISOString();

        await client.query(
          `INSERT INTO support_tickets (ticket_id, user_id, category, priority, status, subject, description, assigned_to, sla_deadline, created_at, updated_at, resolved_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [ticketId, user.userId, template.category, template.priority, template.status, template.subject, template.description, assignedTo, slaDeadline, createdAt, updatedAt, resolvedAt]
        );

        // Add ticket updates
        await client.query(
          `INSERT INTO ticket_updates (update_id, ticket_id, user_type, message, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [uuidv4(), ticketId, 'customer', template.description, createdAt]
        );

        if (template.status === 'resolved') {
          await client.query(
            `INSERT INTO ticket_updates (update_id, ticket_id, user_type, message, created_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [uuidv4(), ticketId, 'agent', 'Issue resolved. Thank you for contacting us!', updatedAt]
          );
        } else if (template.status === 'in_progress') {
          await client.query(
            `INSERT INTO ticket_updates (update_id, ticket_id, user_type, message, created_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [uuidv4(), ticketId, 'agent', 'We are looking into this issue. Will update you soon.', updatedAt]
          );
        }

        console.log(`  ✅ Created ${template.status} ticket for ${user.email}: ${template.subject}`);
      }
    }
    console.log('');

    // 8. Create sample notifications
    console.log('🔔 Step 8: Creating notifications...');
    const notificationTypes = [
      { type: 'PUSH', category: 'BILLING', title: 'New Bill Generated', message: 'Your monthly bill for ₹{amount} is ready. Due date: {date}' },
      { type: 'EMAIL', category: 'SAVINGS', title: 'Great Savings This Month!', message: 'You saved ₹{savings} compared to traditional electricity billing.' },
      { type: 'PUSH', category: 'ALERT', title: 'Battery Low', message: 'Your battery backup is running low. Consider charging.' },
      { type: 'IN_APP', category: 'OUTAGE', title: 'Scheduled Maintenance', message: 'Scheduled maintenance on {date}. Minimal disruption expected.' },
      { type: 'SMS', category: 'BILLING', title: 'Payment Reminder', message: 'Your bill of ₹{amount} is due in 3 days. Please pay to avoid late fees.' },
    ];

    for (let i = 0; i < userIds.length; i++) {
      const user = userIds[i];
      const numNotifications = Math.floor(Math.random() * 3) + 2; // 2-4 notifications per user

      for (let j = 0; j < numNotifications; j++) {
        const notifTemplate = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const notificationId = uuidv4();
        const createdAt = moment().subtract(Math.floor(Math.random() * 15), 'days').toISOString();
        const isRead = Math.random() > 0.5;
        const isSent = moment(createdAt).isBefore(moment().subtract(1, 'hour'));

        let message = notifTemplate.message;
        if (message.includes('{amount}')) {
          message = message.replace('{amount}', (Math.random() * 2000 + 500).toFixed(2));
        }
        if (message.includes('{savings}')) {
          message = message.replace('{savings}', (Math.random() * 1000 + 200).toFixed(2));
        }
        if (message.includes('{date}')) {
          message = message.replace('{date}', moment().add(Math.floor(Math.random() * 7), 'days').format('MMM DD'));
        }

        await client.query(
          `INSERT INTO notifications (notification_id, user_id, type, category, title, message, status, sent_at, read_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [notificationId, user.userId, notifTemplate.type, notifTemplate.category, notifTemplate.title, message, 
           isSent ? 'SENT' : 'PENDING', isSent ? createdAt : null, isRead ? moment(createdAt).add(1, 'hour').toISOString() : null, createdAt]
        );
      }
    }
    console.log('  ✅ Created sample notifications for all users');
    console.log('');

    await client.query('COMMIT');
    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ ${plans.length} plans created`);
    console.log(`   ✅ ${userIds.length} users created`);
    console.log(`   ✅ ${subscriptionIds.length} subscriptions created`);
    console.log(`   ✅ ${meterIds.length} smart meters created`);
    console.log(`   ✅ ~720 energy readings per user (30 days × 24 hours)`);
    console.log(`   ✅ 2 bills per user (1 paid, 1 pending)`);
    console.log(`   ✅ 2-3 support tickets per user`);
    console.log(`   ✅ 2-4 notifications per user`);
    console.log('\n🔑 Demo Credentials:');
    users.forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.email} / Demo@123`);
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seeding error:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    client.release();
  }
};

seedDatabase()
  .then(() => {
    console.log('\n✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  });
