import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Zap, LogOut, User, Menu, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationCenter from '../notifications/NotificationCenter.jsx';
import { notificationService } from '../../services/notificationService.js';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      loadUnreadCount();
      // Refresh unread count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.userId]);

  const loadUnreadCount = async () => {
    if (!user?.userId) return;
    try {
      const count = await notificationService.getUnreadCount(user.userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EaaS</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/billing"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Billing
                </Link>
                <Link
                  to="/support"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Support
                </Link>
                <Link
                  to="/subscription"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Subscription
                </Link>
                <button
                  onClick={() => setNotificationOpen(true)}
                  className="relative text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={() => setNotificationOpen(true)}
                  className="relative text-gray-700 p-2"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 p-2"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/billing"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Billing
            </Link>
            <Link
              to="/subscription"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Subscription
            </Link>
            <Link
              to="/support"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <Link
              to="/profile"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {isAuthenticated && (
        <NotificationCenter 
          isOpen={notificationOpen} 
          onClose={() => {
            setNotificationOpen(false);
            loadUnreadCount(); // Refresh count when closing
          }} 
        />
      )}
    </nav>
  );
};

export default Navbar;

