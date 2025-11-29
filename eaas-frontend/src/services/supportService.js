import api from './api.js';
import { mockTickets } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const supportService = {
  createTicket: async (ticketData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newTicket = {
        ticket_id: `ticket_${Date.now()}`,
        user_id: ticketData.user_id || 'user_123',
        category: ticketData.category || 'general',
        priority: ticketData.priority || 'medium',
        status: 'open',
        subject: ticketData.subject,
        description: ticketData.description,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        resolved_at: null
      };
      mockTickets.unshift(newTicket); // Add to beginning
      return { ticket: newTicket };
    }
    
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.warn('Using mock ticket creation');
      const newTicket = {
        ticket_id: `ticket_${Date.now()}`,
        ...ticketData,
        status: 'open',
        created_at: new Date().toISOString()
      };
      return { ticket: newTicket };
    }
  },

  getUserTickets: async (userId, status = null) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      let tickets = mockTickets.filter(t => t.user_id === userId);
      if (status && status !== 'all') {
        tickets = tickets.filter(t => t.status === status);
      }
      return tickets;
    }
    
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await api.get(`/tickets/user/${userId}`, { params });
      return response.data.tickets;
    } catch (error) {
      console.warn('Using mock tickets data');
      return mockTickets;
    }
  },

  getTicketById: async (ticketId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.ticket_id === ticketId) || mockTickets[0];
      return { ticket, replies: [] };
    }
    
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock ticket data');
      const ticket = mockTickets.find(t => t.ticket_id === ticketId) || mockTickets[0];
      return { ticket, replies: [] };
    }
  },

  addTicketReply: async (ticketId, message, attachmentUrl = null) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        reply: {
          reply_id: `reply_${Date.now()}`,
          ticket_id: ticketId,
          message,
          attachment_url: attachmentUrl,
          created_at: new Date().toISOString()
        }
      };
    }
    
    try {
      const response = await api.post(`/tickets/${ticketId}/reply`, {
        message,
        attachment_url: attachmentUrl,
      });
      return response.data;
    } catch (error) {
      console.warn('Using mock ticket reply');
      return {
        reply: {
          reply_id: `reply_${Date.now()}`,
          ticket_id: ticketId,
          message,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  updateTicketStatus: async (ticketId, status) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const ticket = mockTickets.find(t => t.ticket_id === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updated_at = new Date().toISOString();
        if (status === 'resolved') {
          ticket.resolved_at = new Date().toISOString();
        }
      }
      return { ticket: ticket || mockTickets[0] };
    }
    
    try {
      const response = await api.put(`/tickets/${ticketId}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn('Using mock ticket status update');
      return { ticket: mockTickets.find(t => t.ticket_id === ticketId) || mockTickets[0] };
    }
  },
};

