import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import TicketList from '../components/support/TicketList.jsx';
import NewTicketModal from '../components/support/NewTicketModal.jsx';
import TicketDetail from '../components/support/TicketDetail.jsx';
import SupportFAQ from '../components/support/SupportFAQ.jsx';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';

const Support = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

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
                      onClick={() => setShowModal(true)}
                      className="btn btn-primary flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </button>
                  </div>

                  <NewTicketModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                      setListRefreshKey((k) => k + 1);
                    }}
                  />

                  <div className="mb-6 flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'open', label: 'Open' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'resolved', label: 'Resolved' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setStatusFilter(value)}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === value
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <TicketList userId={user?.userId} statusFilter={statusFilter} refreshKey={listRefreshKey} />
                  <SupportFAQ />
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

