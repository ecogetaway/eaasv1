import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import BillList from '../components/billing/BillList.jsx';
import BillDetail from '../components/billing/BillDetail.jsx';
import { useEffect } from 'react';

const Billing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
                  <h1 className="text-3xl font-bold mb-8">Billing</h1>
                  <BillList userId={user?.userId} />
                </>
              }
            />
            <Route path="/:billId" element={<BillDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Billing;

