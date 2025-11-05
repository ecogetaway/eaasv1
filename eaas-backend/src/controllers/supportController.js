import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import emailService from '../services/emailService.js';

export const createTicket = async (req, res, next) => {
  try {
    const { category, priority, subject, description, attachment_url } = req.body;
    const userId = req.user.userId;

    // Auto-assign based on category
    const assignMap = {
      technical: 'Support Agent 1',
      billing: 'Support Agent 2',
      installation: 'Support Agent 3',
      general: 'Support Agent 1',
    };

    const ticketId = uuidv4();
    const assignedTo = assignMap[category] || 'Support Agent 1';

    const result = await pool.query(
      `INSERT INTO support_tickets (
        ticket_id, user_id, category, priority, status, subject, description, attachment_url, assigned_to
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [ticketId, userId, category, priority, 'open', subject, description, attachment_url || null, assignedTo]
    );

    const ticket = result.rows[0];

    // Create initial update
    await pool.query(
      `INSERT INTO ticket_updates (update_id, ticket_id, user_type, user_id, message, attachment_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), ticketId, 'customer', userId, description, attachment_url || null]
    );

    // Send notification email (mock)
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    await emailService.sendTicketUpdateEmail(userResult.rows[0], ticket, { message: description });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTickets = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { status } = req.query;

    let query = `SELECT * FROM support_tickets WHERE user_id = $1`;
    const params = [userId];

    if (status && status !== 'all') {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    res.json({ tickets: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.userId;

    // Get ticket
    const ticketResult = await pool.query(
      `SELECT * FROM support_tickets WHERE ticket_id = $1 AND user_id = $2`,
      [ticketId, userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    // Get ticket updates
    const updatesResult = await pool.query(
      `SELECT * FROM ticket_updates 
       WHERE ticket_id = $1 
       ORDER BY created_at ASC`,
      [ticketId]
    );

    res.json({
      ticket,
      updates: updatesResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const addTicketReply = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { message, attachment_url } = req.body;
    const userId = req.user.userId;

    // Verify ticket belongs to user
    const ticketResult = await pool.query(
      `SELECT * FROM support_tickets WHERE ticket_id = $1 AND user_id = $2`,
      [ticketId, userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    // Add update
    const updateId = uuidv4();
    await pool.query(
      `INSERT INTO ticket_updates (update_id, ticket_id, user_type, user_id, message, attachment_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [updateId, ticketId, 'customer', userId, message, attachment_url || null]
    );

    // Update ticket updated_at
    await pool.query(
      `UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE ticket_id = $1`,
      [ticketId]
    );

    // Send notification (mock)
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    await emailService.sendTicketUpdateEmail(userResult.rows[0], ticket, { message });

    res.json({
      message: 'Reply added successfully',
      update: {
        update_id: updateId,
        message,
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    // Verify ticket belongs to user
    const ticketResult = await pool.query(
      `SELECT * FROM support_tickets WHERE ticket_id = $1 AND user_id = $2`,
      [ticketId, userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update status
    const resolvedAt = status === 'resolved' ? new Date() : null;
    await pool.query(
      `UPDATE support_tickets 
       SET status = $1, updated_at = CURRENT_TIMESTAMP, resolved_at = $2 
       WHERE ticket_id = $3`,
      [status, resolvedAt, ticketId]
    );

    res.json({ message: 'Ticket status updated successfully' });
  } catch (error) {
    next(error);
  }
};

