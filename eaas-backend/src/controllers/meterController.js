import pool from '../config/database.js';

/**
 * Get all smart meters for a user
 * GET /api/meters/user/:userId
 */
export const getUserMeters = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.userId; // From auth middleware

    // Verify user can only access their own meters
    if (authenticatedUserId && authenticatedUserId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT 
        meter_id,
        user_id,
        meter_number,
        device_type,
        firmware_version,
        installation_date,
        last_sync,
        sync_frequency,
        communication_protocol,
        status,
        calibration_date,
        CASE 
          WHEN last_sync IS NULL THEN 'offline'
          WHEN last_sync > NOW() - INTERVAL '1 hour' THEN 'online'
          WHEN last_sync > NOW() - INTERVAL '24 hours' THEN 'warning'
          ELSE 'offline'
        END as connection_status,
        CASE
          WHEN last_sync IS NULL THEN 'pending'
          WHEN last_sync > NOW() - INTERVAL '5 minutes' THEN 'synced'
          ELSE 'pending'
        END as sync_status
      FROM smart_meters 
      WHERE user_id = $1 
      ORDER BY installation_date DESC`,
      [userId]
    );

    res.json({ meters: result.rows });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific meter by ID
 * GET /api/meters/:meterId
 */
export const getMeterById = async (req, res, next) => {
  try {
    const { meterId } = req.params;
    const authenticatedUserId = req.user?.userId;

    const result = await pool.query(
      `SELECT 
        meter_id,
        user_id,
        meter_number,
        device_type,
        firmware_version,
        installation_date,
        last_sync,
        sync_frequency,
        communication_protocol,
        status,
        calibration_date,
        CASE 
          WHEN last_sync IS NULL THEN 'offline'
          WHEN last_sync > NOW() - INTERVAL '1 hour' THEN 'online'
          WHEN last_sync > NOW() - INTERVAL '24 hours' THEN 'warning'
          ELSE 'offline'
        END as connection_status,
        CASE
          WHEN last_sync IS NULL THEN 'pending'
          WHEN last_sync > NOW() - INTERVAL '5 minutes' THEN 'synced'
          ELSE 'pending'
        END as sync_status
      FROM smart_meters 
      WHERE meter_id = $1`,
      [meterId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    const meter = result.rows[0];

    // Verify user can only access their own meters
    if (authenticatedUserId && authenticatedUserId !== meter.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ meter });
  } catch (error) {
    next(error);
  }
};

/**
 * Sync a meter (update last_sync timestamp)
 * POST /api/meters/:meterId/sync
 */
export const syncMeter = async (req, res, next) => {
  try {
    const { meterId } = req.params;
    const authenticatedUserId = req.user?.userId;

    // First, get the meter to verify ownership
    const meterResult = await pool.query(
      'SELECT user_id FROM smart_meters WHERE meter_id = $1',
      [meterId]
    );

    if (meterResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    const meter = meterResult.rows[0];

    // Verify user can only sync their own meters
    if (authenticatedUserId && authenticatedUserId !== meter.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update last_sync timestamp
    const updateResult = await pool.query(
      `UPDATE smart_meters 
       SET last_sync = NOW() 
       WHERE meter_id = $1 
       RETURNING 
         meter_id,
         user_id,
         meter_number,
         device_type,
         firmware_version,
         installation_date,
         last_sync,
         sync_frequency,
         communication_protocol,
         status,
         calibration_date,
         CASE 
           WHEN last_sync IS NULL THEN 'offline'
           WHEN last_sync > NOW() - INTERVAL '1 hour' THEN 'online'
           WHEN last_sync > NOW() - INTERVAL '24 hours' THEN 'warning'
           ELSE 'offline'
         END as connection_status,
         CASE
           WHEN last_sync IS NULL THEN 'pending'
           WHEN last_sync > NOW() - INTERVAL '5 minutes' THEN 'synced'
           ELSE 'pending'
         END as sync_status`,
      [meterId]
    );

    res.json({
      message: 'Meter sync initiated successfully',
      meter: updateResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new meter
 * POST /api/meters
 */
export const registerMeter = async (req, res, next) => {
  try {
    const authenticatedUserId = req.user?.userId;
    const {
      meter_number,
      device_type,
      firmware_version,
      installation_date,
      sync_frequency,
      communication_protocol,
      calibration_date,
    } = req.body;

    if (!meter_number || !authenticatedUserId) {
      return res.status(400).json({ error: 'Meter number and user ID are required' });
    }

    // Check if meter number already exists
    const existingMeter = await pool.query(
      'SELECT meter_id FROM smart_meters WHERE meter_number = $1',
      [meter_number]
    );

    if (existingMeter.rows.length > 0) {
      return res.status(409).json({ error: 'Meter number already registered' });
    }

    // Insert new meter
    const result = await pool.query(
      `INSERT INTO smart_meters (
        user_id,
        meter_number,
        device_type,
        firmware_version,
        installation_date,
        last_sync,
        sync_frequency,
        communication_protocol,
        status,
        calibration_date
      ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, 'active', $8)
      RETURNING 
        meter_id,
        user_id,
        meter_number,
        device_type,
        firmware_version,
        installation_date,
        last_sync,
        sync_frequency,
        communication_protocol,
        status,
        calibration_date,
        'online' as connection_status,
        'synced' as sync_status`,
      [
        authenticatedUserId,
        meter_number,
        device_type || 'Smart Energy Meter',
        firmware_version || 'v2.1.3',
        installation_date || new Date().toISOString().split('T')[0],
        sync_frequency || 300,
        communication_protocol || 'MQTT',
        calibration_date || new Date().toISOString().split('T')[0],
      ]
    );

    res.status(201).json({
      message: 'Meter registered successfully',
      meter: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

