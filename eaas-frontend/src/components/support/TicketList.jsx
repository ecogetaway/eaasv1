import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supportService } from '../../services/supportService.js';
import { formatDate, getTimeAgo } from '../../utils/formatters.js';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TicketList = ({ userId, statusFilter = 'all' }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [userId, statusFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getUserTickets(userId, statusFilter === 'all' ? null : statusFilter);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="card text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Link
          key={ticket.ticket_id}
          to={`/support/${ticket.ticket_id}`}
          className="card hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-mono text-gray-500">
                  #{ticket.ticket_id.substring(0, 8)}
                </span>
                <span className={cn('badge flex items-center space-x-1', STATUS_COLORS[ticket.status])}>
                  {getStatusIcon(ticket.status)}
                  <span>{ticket.status}</span>
                </span>
                <span className={cn('badge', PRIORITY_COLORS[ticket.priority])}>
                  {ticket.priority}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Category: {ticket.category}</span>
                <span>Created: {getTimeAgo(ticket.created_at)}</span>
                {ticket.assigned_to && (
                  <span>Assigned to: {ticket.assigned_to}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TicketList;

