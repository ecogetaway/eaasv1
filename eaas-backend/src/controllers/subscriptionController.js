import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import emailService from '../services/emailService.js';

export const getPlans = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM plan_catalog WHERE is_active = true ORDER BY monthly_fee ASC`
    );
    res.json({ plans: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const result = await pool.query('SELECT * FROM plan_catalog WHERE plan_id = $1', [planId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const recommendPlan = async (req, res, next) => {
  try {
    const { monthlyBill } = req.query;
    const billAmount = parseFloat(monthlyBill) || 0;

    // Get all active plans
    const result = await pool.query(
      `SELECT * FROM plan_catalog WHERE is_active = true ORDER BY monthly_fee ASC`
    );

    const plans = result.rows;

    // Recommend plan based on bill amount
    let recommendedPlan = plans[0]; // Default to cheapest
    if (billAmount > 5000) {
      recommendedPlan = plans.find(p => p.plan_type === 'premium') || plans[plans.length - 1];
    } else if (billAmount > 3000) {
      recommendedPlan = plans.find(p => p.plan_type === 'solar_battery') || plans[1];
    }

    res.json({
      plans,
      recommended: recommendedPlan?.plan_id,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const { plan_id, address, monthly_bill } = req.body;
    const userId = req.user.userId;

    // Get plan details
    const planResult = await pool.query('SELECT * FROM plan_catalog WHERE plan_id = $1', [plan_id]);
    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.rows[0];

    // Check if user already has active subscription
    const existingSub = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (existingSub.rows.length > 0) {
      return res.status(409).json({ error: 'User already has an active subscription' });
    }

    // Create subscription
    const subscriptionId = uuidv4();
    const startDate = moment().format('YYYY-MM-DD');
    const nextBillingDate = moment().add(1, 'month').format('YYYY-MM-DD');

    const result = await pool.query(
      `INSERT INTO subscriptions (
        subscription_id, user_id, plan_type, monthly_fee,
        installation_capacity, battery_capacity, status, start_date, next_billing_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        subscriptionId,
        userId,
        plan.plan_type,
        plan.monthly_fee,
        plan.solar_capacity,
        plan.battery_capacity,
        'active',
        startDate,
        nextBillingDate,
      ]
    );

    const subscription = result.rows[0];

    // Update user address if provided
    if (address) {
      await pool.query('UPDATE users SET address = $1 WHERE user_id = $2', [address, userId]);
    }

    // Send welcome email (mock)
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    await emailService.sendWelcomeEmail(userResult.rows[0], subscription);

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const result = await pool.query(
      `SELECT s.*, p.plan_name, p.features
       FROM subscriptions s
       LEFT JOIN plan_catalog p ON s.plan_type = p.plan_type
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );

    res.json({ subscriptions: result.rows });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT s.*, p.plan_name, p.features
       FROM subscriptions s
       LEFT JOIN plan_catalog p ON s.plan_type = p.plan_type
       WHERE s.subscription_id = $1 AND s.user_id = $2`,
      [subscriptionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.error('Error fetching subscription by ID:', error);
    next(error);
  }
};

