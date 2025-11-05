import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService.js';
import { formatDateTime, getTimeAgo } from '../../utils/formatters.js';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { ArrowLeft, Send, User, HeadphonesIcon } from 'lucide-react';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await supportService.getTicketById(ticketId);
      setTicket(data.ticket);
      setUpdates(data.updates || []);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      setSending(true);
      await supportService.addTicketReply(ticketId, replyMessage);
      setReplyMessage('');
      loadTicket(); // Reload to get new updates
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/support')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tickets
      </button>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-mono text-gray-500">
                #{ticket.ticket_id.substring(0, 8)}
              </span>
              <span className={cn('badge', STATUS_COLORS[ticket.status])}>
                {ticket.status}
              </span>
              <span className={cn('badge', PRIORITY_COLORS[ticket.priority])}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
            <p className="text-gray-600 mb-4">{ticket.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Category</div>
            <div className="font-semibold">{ticket.category}</div>
          </div>
          <div>
            <div className="text-gray-600">Priority</div>
            <div className="font-semibold">{ticket.priority}</div>
          </div>
          <div>
            <div className="text-gray-600">Created</div>
            <div className="font-semibold">{getTimeAgo(ticket.created_at)}</div>
          </div>
          {ticket.assigned_to && (
            <div>
              <div className="text-gray-600">Assigned To</div>
              <div className="font-semibold">{ticket.assigned_to}</div>
            </div>
          )}
        </div>

        {ticket.status !== 'resolved' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Expected resolution in 18 hours
            </p>
          </div>
        )}
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Conversation</h3>
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.update_id}
              className={cn(
                'flex items-start space-x-3 p-4 rounded-lg',
                update.user_type === 'customer' ? 'bg-blue-50' : 'bg-gray-50'
              )}
            >
              <div className={cn(
                'p-2 rounded-full',
                update.user_type === 'customer' ? 'bg-blue-200' : 'bg-gray-200'
              )}>
                {update.user_type === 'customer' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <HeadphonesIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    {update.user_type === 'customer' ? 'You' : 'Support Agent'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(update.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{update.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {ticket.status !== 'resolved' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Add Reply</h3>
          <div className="space-y-4">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="input"
              rows={4}
              placeholder="Type your message here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                disabled={sending || !replyMessage.trim()}
                className="btn btn-primary flex items-center"
              >
                {sending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;

