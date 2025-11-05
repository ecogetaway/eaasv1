import pool from '../config/database.js';

export const getUserAlerts = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { severity, resolved } = req.query;

    let query = `SELECT * FROM alerts WHERE user_id = $1`;
    const params = [userId];
    let paramIndex = 2;

    if (severity) {
      query += ` AND severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    if (resolved === 'false' || resolved === false) {
      query += ` AND resolved_at IS NULL`;
    } else if (resolved === 'true' || resolved === true) {
      query += ` AND resolved_at IS NOT NULL`;
    }

    query += ` ORDER BY triggered_at DESC LIMIT 50`;

    const result = await pool.query(query, params);

    res.json({ alerts: result.rows });
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.userId;

    // Verify alert belongs to user
    const checkResult = await pool.query(
      `SELECT alert_id FROM alerts WHERE alert_id = $1 AND user_id = $2`,
      [alertId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await pool.query(
      `UPDATE alerts SET acknowledged_at = CURRENT_TIMESTAMP 
       WHERE alert_id = $1 AND acknowledged_at IS NULL`,
      [alertId]
    );

    res.json({ message: 'Alert acknowledged' });
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.userId;

    // Verify alert belongs to user
    const checkResult = await pool.query(
      `SELECT alert_id FROM alerts WHERE alert_id = $1 AND user_id = $2`,
      [alertId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await pool.query(
      `UPDATE alerts SET resolved_at = CURRENT_TIMESTAMP 
       WHERE alert_id = $1`,
      [alertId]
    );

    res.json({ message: 'Alert resolved' });
  } catch (error) {
    next(error);
  }
};

