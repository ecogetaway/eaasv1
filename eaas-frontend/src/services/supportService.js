import api from './api.js';

export const supportService = {
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  getUserTickets: async (userId, status = null) => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get(`/tickets/user/${userId}`, { params });
    return response.data.tickets;
  },

  getTicketById: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },

  addTicketReply: async (ticketId, message, attachmentUrl = null) => {
    const response = await api.post(`/tickets/${ticketId}/reply`, {
      message,
      attachment_url: attachmentUrl,
    });
    return response.data;
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },
};

