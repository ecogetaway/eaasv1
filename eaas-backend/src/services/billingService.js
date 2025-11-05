import pool from '../config/database.js';
import { ENERGY_RATES, CARBON_FACTOR } from '../config/constants.js';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

class BillingService {
  // Calculate bill for a billing period
  async calculateBill(userId, subscriptionId, periodStart, periodEnd) {
    try {
      // Get subscription details
      const subResult = await pool.query(
        `SELECT * FROM subscriptions WHERE subscription_id = $1 AND user_id = $2`,
        [subscriptionId, userId]
      );

      if (subResult.rows.length === 0) {
        throw new Error('Subscription not found');
      }

      const subscription = subResult.rows[0];

      // Aggregate energy data for the period
      const energyResult = await pool.query(
        `SELECT 
          SUM(total_consumption) as total_consumption,
          SUM(solar_generation) as solar_units,
          SUM(grid_import) as grid_units,
          SUM(grid_export) as export_units
         FROM energy_data
         WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3`,
        [userId, periodStart, periodEnd]
      );

      const energy = energyResult.rows[0] || {};
      // Safely parse values, defaulting to 0 if null/undefined/NaN
      const totalConsumption = parseFloat(energy.total_consumption || 0) || 0;
      const solarUnits = parseFloat(energy.solar_units || 0) || 0;
      const gridUnits = parseFloat(energy.grid_units || 0) || 0;
      const exportUnits = parseFloat(energy.export_units || 0) || 0;

      // Calculate charges with safe defaults
      const subscriptionCharge = parseFloat(subscription.monthly_fee || 0) || 0;
      const energyCharge = (gridUnits || 0) * (ENERGY_RATES?.GRID_IMPORT || 7.5);
      const netMeteringCredit = (exportUnits || 0) * (ENERGY_RATES?.GRID_EXPORT || 5.0);
      const taxAmount = (subscriptionCharge + energyCharge - netMeteringCredit) * 0.18; // 18% GST
      const totalAmount = subscriptionCharge + energyCharge - netMeteringCredit + taxAmount;

      // Calculate savings vs traditional
      const traditionalBill = (totalConsumption || 0) * (ENERGY_RATES?.TRADITIONAL_RATE || 8.5);
      const savings = Math.max(0, traditionalBill - totalAmount);

      // Calculate carbon offset (kg CO2 per kWh)
      const carbonOffset = (solarUnits || 0) * (CARBON_FACTOR || 0.8);

      return {
        total_consumption: parseFloat(totalConsumption.toFixed(2)) || 0,
        solar_units: parseFloat(solarUnits.toFixed(2)) || 0,
        grid_units: parseFloat(gridUnits.toFixed(2)) || 0,
        export_units: parseFloat(exportUnits.toFixed(2)) || 0,
        subscription_charge: parseFloat(subscriptionCharge.toFixed(2)) || 0,
        energy_charge: parseFloat(energyCharge.toFixed(2)) || 0,
        net_metering_credit: parseFloat(netMeteringCredit.toFixed(2)) || 0,
        tax_amount: parseFloat(taxAmount.toFixed(2)) || 0,
        total_amount: parseFloat(totalAmount.toFixed(2)) || 0,
        savings_vs_traditional: parseFloat(savings.toFixed(2)) || 0,
        carbon_offset: parseFloat(carbonOffset.toFixed(2)) || 0,
      };
    } catch (error) {
      console.error('Error calculating bill:', error);
      throw error;
    }
  }

  // Generate monthly bill
  async generateMonthlyBill(userId, subscriptionId) {
    try {
      // Get subscription
      const subResult = await pool.query(
        `SELECT * FROM subscriptions WHERE subscription_id = $1 AND user_id = $2`,
        [subscriptionId, userId]
      );

      if (subResult.rows.length === 0) {
        throw new Error('Subscription not found');
      }

      const subscription = subResult.rows[0];

      // Determine billing period (last month)
      const periodEnd = moment(subscription.next_billing_date).subtract(1, 'day');
      const periodStart = moment(periodEnd).startOf('month');

      // Check if bill already exists
      const existingBill = await pool.query(
        `SELECT * FROM bills 
         WHERE user_id = $1 AND subscription_id = $2 
         AND billing_period_start = $3 AND billing_period_end = $4`,
        [userId, subscriptionId, periodStart.format('YYYY-MM-DD'), periodEnd.format('YYYY-MM-DD')]
      );

      if (existingBill.rows.length > 0) {
        return existingBill.rows[0];
      }

      // Calculate bill
      const billData = await this.calculateBill(
        userId,
        subscriptionId,
        periodStart.toISOString(),
        periodEnd.toISOString()
      );

      // Create bill record
      const billId = uuidv4();
      const invoiceUrl = `/api/bills/${billId}/invoice`;

      const insertResult = await pool.query(
        `INSERT INTO bills (
          bill_id, user_id, subscription_id, billing_period_start, billing_period_end,
          total_consumption, solar_units, grid_units,
          subscription_charge, energy_charge, net_metering_credit, tax_amount, total_amount,
          savings_vs_traditional, carbon_offset, status, invoice_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          billId,
          userId,
          subscriptionId,
          periodStart.format('YYYY-MM-DD'),
          periodEnd.format('YYYY-MM-DD'),
          billData.total_consumption,
          billData.solar_units,
          billData.grid_units,
          billData.subscription_charge,
          billData.energy_charge,
          billData.net_metering_credit,
          billData.tax_amount,
          billData.total_amount,
          billData.savings_vs_traditional,
          billData.carbon_offset,
          'pending',
          invoiceUrl,
        ]
      );

      // Update next billing date
      await pool.query(
        `UPDATE subscriptions 
         SET next_billing_date = $1, updated_at = CURRENT_TIMESTAMP
         WHERE subscription_id = $2`,
        [moment(periodEnd).add(1, 'month').format('YYYY-MM-DD'), subscriptionId]
      );

      return insertResult.rows[0];
    } catch (error) {
      console.error('Error generating monthly bill:', error);
      throw error;
    }
  }

  // Get current month provisional bill
  async getCurrentMonthBill(userId, subscriptionId) {
    try {
      const periodStart = moment().startOf('month');
      const periodEnd = moment();

      const billData = await this.calculateBill(
        userId,
        subscriptionId,
        periodStart.toISOString(),
        periodEnd.toISOString()
      );

      return {
        ...billData,
        billing_period_start: periodStart.format('YYYY-MM-DD'),
        billing_period_end: periodEnd.format('YYYY-MM-DD'),
        is_provisional: true,
      };
    } catch (error) {
      console.error('Error getting current month bill:', error);
      throw error;
    }
  }
}

export default new BillingService();

