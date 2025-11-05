import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService.js';
import { TICKET_CATEGORY, TICKET_PRIORITY } from '../../utils/constants.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const TicketForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'general',
    priority: 'medium',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const result = await supportService.createTicket(formData);
      
      if (onSuccess) {
        onSuccess(result.ticket);
      } else {
        navigate(`/support/${result.ticket.ticket_id}`);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <h2 className="text-2xl font-bold">Create Support Ticket</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input"
            required
          >
            {Object.entries(TICKET_CATEGORY).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority *
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="input"
            required
          >
            {Object.entries(TICKET_PRIORITY).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="input"
          placeholder="Brief description of your issue"
          required
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input"
          rows={6}
          placeholder="Please provide detailed information about your issue..."
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/support')}
          className="btn btn-secondary"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Submitting...</span>
            </span>
          ) : (
            'Submit Ticket'
          )}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;

