import pool from '../config/database.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { status, type, limit = 50 } = req.query;

    let query = `SELECT * FROM notifications WHERE user_id = $1`;
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));

    const result = await pool.query(query, params);

    res.json({ notifications: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const result = await pool.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );

    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    // Verify notification belongs to user
    const checkResult = await pool.query(
      `SELECT notification_id FROM notifications 
       WHERE notification_id = $1 AND user_id = $2`,
      [notificationId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await pool.query(
      `UPDATE notifications SET read_at = CURRENT_TIMESTAMP 
       WHERE notification_id = $1`,
      [notificationId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await pool.query(
      `UPDATE notifications SET read_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

