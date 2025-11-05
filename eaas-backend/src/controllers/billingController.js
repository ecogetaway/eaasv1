import pool from '../config/database.js';
import billingService from '../services/billingService.js';
import pdfService from '../services/pdfService.js';
import emailService from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserBills = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const result = await pool.query(
      `SELECT * FROM bills 
       WHERE user_id = $1 
       ORDER BY billing_period_end DESC`,
      [userId]
    );

    // Ensure all numeric fields have proper defaults
    const formattedBills = result.rows.map(bill => ({
      ...bill,
      total_amount: parseFloat(bill.total_amount || 0) || 0,
      savings_vs_traditional: parseFloat(bill.savings_vs_traditional || 0) || 0,
      carbon_offset: parseFloat(bill.carbon_offset || 0) || 0,
      total_consumption: parseFloat(bill.total_consumption || 0) || 0,
      solar_units: parseFloat(bill.solar_units || 0) || 0,
      grid_units: parseFloat(bill.grid_units || 0) || 0,
      subscription_charge: parseFloat(bill.subscription_charge || 0) || 0,
      energy_charge: parseFloat(bill.energy_charge || 0) || 0,
      net_metering_credit: parseFloat(bill.net_metering_credit || 0) || 0,
      tax_amount: parseFloat(bill.tax_amount || 0) || 0,
    }));

    res.json({ bills: formattedBills });
  } catch (error) {
    next(error);
  }
};

export const getBillById = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT b.*, s.plan_type, s.installation_capacity, s.battery_capacity
       FROM bills b
       LEFT JOIN subscriptions s ON b.subscription_id = s.subscription_id
       WHERE b.bill_id = $1 AND b.user_id = $2`,
      [billId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Format bill with proper defaults
    const bill = result.rows[0];
    const formattedBill = {
      ...bill,
      total_amount: parseFloat(bill.total_amount || 0) || 0,
      savings_vs_traditional: parseFloat(bill.savings_vs_traditional || 0) || 0,
      carbon_offset: parseFloat(bill.carbon_offset || 0) || 0,
      total_consumption: parseFloat(bill.total_consumption || 0) || 0,
      solar_units: parseFloat(bill.solar_units || 0) || 0,
      grid_units: parseFloat(bill.grid_units || 0) || 0,
      subscription_charge: parseFloat(bill.subscription_charge || 0) || 0,
      energy_charge: parseFloat(bill.energy_charge || 0) || 0,
      net_metering_credit: parseFloat(bill.net_metering_credit || 0) || 0,
      tax_amount: parseFloat(bill.tax_amount || 0) || 0,
    };

    res.json({ bill: formattedBill });
  } catch (error) {
    next(error);
  }
};

export const getCurrentMonthBill = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;

    // Get user's active subscription
    const subResult = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subResult.rows[0];
    const billData = await billingService.getCurrentMonthBill(userId, subscription.subscription_id);

    res.json({ bill: billData });
  } catch (error) {
    next(error);
  }
};

export const generateInvoice = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const userId = req.user.userId;

    // Get bill
    const billResult = await pool.query(
      `SELECT b.*, s.plan_type, s.installation_capacity, s.battery_capacity
       FROM bills b
       LEFT JOIN subscriptions s ON b.subscription_id = s.subscription_id
       WHERE b.bill_id = $1 AND b.user_id = $2`,
      [billId, userId]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const bill = billResult.rows[0];

    // Get user
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    const user = userResult.rows[0];

    // Generate PDF
    const pdfBuffer = await pdfService.generateInvoice(bill, user, bill);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${billId.substring(0, 8)}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const { payment_method } = req.body;
    const userId = req.user.userId;

    // Get bill
    const billResult = await pool.query(
      `SELECT * FROM bills WHERE bill_id = $1 AND user_id = $2`,
      [billId, userId]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const bill = billResult.rows[0];

    if (bill.status === 'paid') {
      return res.status(400).json({ error: 'Bill already paid' });
    }

    // Mock payment processing (2 second delay)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create payment record
    const paymentId = uuidv4();
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    await pool.query(
      `INSERT INTO payments (payment_id, bill_id, user_id, amount, payment_method, transaction_id, status, payment_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
      [paymentId, billId, userId, bill.total_amount, payment_method, transactionId, 'success']
    );

    // Update bill status
    await pool.query(
      `UPDATE bills SET status = 'paid', payment_date = CURRENT_TIMESTAMP WHERE bill_id = $1`,
      [billId]
    );

    // Send payment confirmation email (mock)
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    await emailService.sendPaymentConfirmationEmail(userResult.rows[0], {
      payment_id: paymentId,
      transaction_id: transactionId,
      amount: bill.total_amount,
    });

    res.json({
      message: 'Payment processed successfully',
      payment: {
        payment_id: paymentId,
        transaction_id: transactionId,
        amount: bill.total_amount,
        status: 'success',
      },
    });
  } catch (error) {
    next(error);
  }
};

