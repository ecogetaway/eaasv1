import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService.js';
import { TICKET_CATEGORY, TICKET_CATEGORY_LABELS, TICKET_PRIORITY } from '../../utils/constants.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { X, CheckCircle, Paperclip } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: TICKET_CATEGORY.POWER_OUTAGE, label: TICKET_CATEGORY_LABELS.power_outage },
  { value: TICKET_CATEGORY.SOLAR_PERFORMANCE, label: TICKET_CATEGORY_LABELS.solar_performance },
  { value: TICKET_CATEGORY.BATTERY_ISSUE, label: TICKET_CATEGORY_LABELS.battery_issue },
  { value: TICKET_CATEGORY.BILLING_QUERY, label: TICKET_CATEGORY_LABELS.billing_query },
  { value: TICKET_CATEGORY.INSTALLATION, label: TICKET_CATEGORY_LABELS.installation },
  { value: TICKET_CATEGORY.OTHER, label: TICKET_CATEGORY_LABELS.other },
];

const NewTicketModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: TICKET_CATEGORY.BILLING_QUERY,
    priority: TICKET_PRIORITY.MEDIUM,
    subject: '',
    description: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      alert('Please fill in subject and description');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        category: formData.category,
        priority: formData.priority,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      };
      const result = await supportService.createTicket(payload);
      const ticketId = result.ticket.ticket_id;
      setSuccessTicketId(ticketId);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (successTicketId && onSuccess) {
      onSuccess(successTicketId);
    }
    setFormData({
      category: TICKET_CATEGORY.BILLING_QUERY,
      priority: TICKET_PRIORITY.MEDIUM,
      subject: '',
      description: '',
      file: null,
    });
    setSuccessTicketId(null);
    onClose();
  };

  const handleViewTicket = () => {
    if (successTicketId) {
      navigate(`/support/${successTicketId}`);
      handleClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, file: file || null }));
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="new-ticket-modal-title" className="text-xl font-bold">
            {successTicketId ? 'Ticket Created' : 'New Ticket'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {successTicketId ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Ticket created successfully!
              </p>
              <p className="text-gray-600 mb-6">
                Your ticket ID is <span className="font-mono font-bold text-primary-600">#{successTicketId}</span>
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleViewTicket}
                  className="btn btn-primary"
                >
                  View Ticket
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                  required
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <div className="flex gap-6">
                  {[TICKET_PRIORITY.LOW, TICKET_PRIORITY.MEDIUM, TICKET_PRIORITY.HIGH].map((p) => (
                    <label
                      key={p}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={formData.priority === p}
                        onChange={() => setFormData({ ...formData, priority: p })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="capitalize">{p}</span>
                    </label>
                  ))}
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
                  className="input w-full"
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
                  className="input w-full"
                  rows={5}
                  placeholder="Please provide detailed information about your issue..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach file (optional)
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formData.file ? formData.file.name : 'Choose file'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, JPG, PNG up to 5MB
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;
