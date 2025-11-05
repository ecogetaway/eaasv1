import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import TicketList from '../components/support/TicketList.jsx';
import TicketForm from '../components/support/TicketForm.jsx';
import TicketDetail from '../components/support/TicketDetail.jsx';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';

const Support = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Support</h1>
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="btn btn-primary flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </button>
                  </div>

                  {showForm && (
                    <div className="mb-8">
                      <TicketForm
                        onSuccess={(ticket) => {
                          setShowForm(false);
                          navigate(`/support/${ticket.ticket_id}`);
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-6 flex space-x-2">
                    {['all', 'open', 'in_progress', 'resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === status
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>

                  <TicketList userId={user?.userId} statusFilter={statusFilter} />
                </>
              }
            />
            <Route path="/:ticketId" element={<TicketDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Support;

