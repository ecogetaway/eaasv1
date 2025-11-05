import { Link } from 'react-router-dom';
import { Zap, Sun, Battery, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Energy-as-a-Service
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Switch to solar energy and save money while saving the planet
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline border-white text-white hover:bg-white/10">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose EaaS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Solar Power</h3>
                <p className="text-gray-600">
                  Generate clean energy from the sun and reduce your carbon footprint
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                <p className="text-gray-600">
                  Save up to 40% on your electricity bills with our affordable plans
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Battery className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Battery Backup</h3>
                <p className="text-gray-600">
                  Never worry about power outages with our battery backup solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Basic Solar</h3>
                <p className="text-3xl font-bold text-primary-600 mb-4">₹1,999/mo</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>2kW Solar Panel</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Mobile App Access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Basic Support</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>

              <div className="card text-center border-2 border-primary-600">
                <Battery className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Solar + Battery</h3>
                <p className="text-3xl font-bold text-primary-600 mb-4">₹3,499/mo</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>3kW Solar + 5kWh Battery</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>24/7 Backup Power</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>

              <div className="card text-center">
                <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium</h3>
                <p className="text-3xl font-bold text-primary-600 mb-4">₹4,999/mo</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>5kW Solar + 10kWh Battery</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Smart Home Integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Maintenance Included</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

