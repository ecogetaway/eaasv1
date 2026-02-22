import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Sun, Battery, TrendingUp, Shield, CheckCircle,
  Star, ArrowRight, ClipboardList, Wrench, PiggyBank,
  Home as HomeIcon, Leaf, IndianRupee,
} from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Solar Starter',
    monthly: '₹1,799',
    annual: '₹1,619',
    rate: '₹4.50/kWh',
    icon: Sun,
    gradient: 'from-amber-400 to-orange-500',
    features: [
      '3kW Solar Panel System',
      'Mobile App Monitoring',
      'Basic Support',
      'Annual Maintenance',
    ],
  },
  {
    name: 'Hybrid Freedom',
    monthly: '₹2,499',
    annual: '₹2,249',
    rate: '₹4.00/kWh',
    icon: Battery,
    gradient: 'from-blue-500 to-cyan-500',
    popular: true,
    features: [
      '5kW Solar + 5kWh Battery',
      '24/7 Backup Power',
      'Priority Support',
      'Smart Home Integration',
    ],
  },
  {
    name: 'Grid Independent',
    monthly: '₹3,799',
    annual: '₹3,419',
    rate: '₹3.50/kWh',
    icon: Shield,
    gradient: 'from-green-500 to-emerald-600',
    features: [
      '10kW Solar + 13.5kWh Battery',
      'Full Grid Independence',
      'Dedicated Account Manager',
      'Smart Home Integration',
    ],
  },
];

const STATS = [
  { value: '847', label: 'Homes Powered', icon: HomeIcon },
  { value: '3.2 Lakh kg', label: 'CO₂ Saved', icon: Leaf },
  { value: '₹2.4 Cr', label: 'Saved by Customers', icon: IndianRupee },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Choose Your Plan',
    desc: 'Pick a subscription that fits your energy needs. No upfront cost, no hardware purchase — ever.',
  },
  {
    step: '02',
    icon: Wrench,
    title: 'We Install Everything',
    desc: 'Our certified engineers install and commission your solar system within 7 days. You sit back.',
  },
  {
    step: '03',
    icon: PiggyBank,
    title: 'You Just Save',
    desc: 'Get clean energy at lower rates immediately. Track your savings live on the EaaS app.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Venkataraman',
    city: 'Bengaluru',
    plan: 'Hybrid Freedom',
    stars: 5,
    text: 'My electricity bill dropped from ₹6,200 to ₹2,100 in the first month itself. The installation team was professional and done in a single day. Absolutely zero hassle.',
  },
  {
    name: 'Rajesh Kulkarni',
    city: 'Pune',
    plan: 'Grid Independent',
    stars: 5,
    text: "We had constant power cuts in our area. Since EaaS, we haven't faced a single outage. The battery backup is incredible and we own nothing — EaaS handles everything.",
  },
  {
    name: 'Meera Iyer',
    city: 'Chennai',
    plan: 'Solar Starter',
    stars: 4,
    text: 'Started with the Solar Starter and already saving 38% on power bills. The app is clean and support responded within the hour. Highly recommend.',
  },
];

// ─── Plan Card ────────────────────────────────────────────────────────────────

const PlanCard = ({ plan, billing }) => {
  const Icon = plan.icon;
  const price = billing === 'monthly' ? plan.monthly : plan.annual;

  return (
    <div className={`relative flex flex-col rounded-2xl border bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
            Most Popular
          </span>
        </div>
      )}

      <div className={`rounded-t-2xl bg-gradient-to-br ${plan.gradient} p-6 text-white`}>
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5">
            <Icon size={22} />
          </div>
          <h3 className="text-lg font-bold">{plan.name}</h3>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-extrabold">{price}</span>
          <span className="mb-1 text-sm opacity-80">/mo</span>
        </div>
        {billing === 'annual' && (
          <p className="mt-1 text-xs opacity-80">Billed annually · 10% savings</p>
        )}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          <Zap size={11} />
          {plan.rate}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Core EaaS value prop — must show on every card */}
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
          <p className="text-sm font-bold text-green-700">₹0 Upfront</p>
          <p className="mt-0.5 text-xs text-green-600">
            Zero hardware cost · Equipment owned &amp; maintained by us
          </p>
        </div>

        <ul className="mb-6 flex-1 space-y-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
              <CheckCircle size={16} className="shrink-0 text-green-500" />
              {f}
            </li>
          ))}
        </ul>

        <p className="mb-3 text-center text-xs text-gray-400">
          Grid backup billed at ₹7/kWh (DISCOM rate)
        </p>

        <Link
          to="/register"
          className={`block rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90 bg-gradient-to-r ${plan.gradient}`}
        >
          Get Started <ArrowRight size={14} className="inline ml-1" />
        </Link>
      </div>
    </div>
  );
};

// ─── Star Rating ──────────────────────────────────────────────────────────────

const StarRating = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < count ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
      />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Home = () => {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <style>{`
            @keyframes heroGradient {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .hero-animated-bg {
              background: linear-gradient(135deg, #1e40af, #0369a1, #065f46, #1d4ed8, #0891b2);
              background-size: 300% 300%;
              animation: heroGradient 10s ease infinite;
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
            .fade-up-2 { animation: fadeUp 0.6s ease 0.25s both; }
            .fade-up-3 { animation: fadeUp 0.6s ease 0.4s both; }
            .fade-up-4 { animation: fadeUp 0.6s ease 0.55s both; }
          `}</style>

          <div className="hero-animated-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
              <div className="fade-up-1 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Zap size={14} className="text-amber-300" />
                Clean Energy · Zero Upfront Cost · Fully Managed
              </div>

              <h1 className="fade-up-2 text-4xl md:text-6xl font-bold mb-6 mt-4">
                Energy-as-a-Service
              </h1>
              <p className="fade-up-3 text-xl md:text-2xl mb-8 text-blue-100 max-w-xl mx-auto">
                Switch to solar energy and save money while saving the planet
              </p>

              <div className="fade-up-4 flex flex-col items-center space-y-4">
                <div className="flex justify-center space-x-4">
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline border-white text-white hover:bg-white/10">
                    Login
                  </Link>
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-md w-full">
                  <p className="text-sm font-semibold text-white mb-2 text-center">Try Demo Account</p>
                  <div className="text-xs text-primary-100 space-y-1 text-center">
                    <p><strong>User 1:</strong> demo@eaas.com / demo123</p>
                    <p><strong>User 2:</strong> demo2@eaas.com / demo123</p>
                  </div>
                  <Link
                    to="/login"
                    className="block mt-3 text-center text-sm text-white underline hover:text-primary-100"
                  >
                    Click here to login with demo credentials →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────────────────── */}
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-6 py-6 text-center">
                <Icon size={20} className="text-green-600 mb-1" />
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why EaaS ──────────────────────────────────────────────────── */}
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

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-3">How It Works</h2>
            <p className="text-center text-blue-200 mb-12">
              From sign-up to savings in as little as 7 days
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
                <div
                  key={step}
                  className="relative flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-amber-900">
                    Step {step}
                  </div>
                  <div className="mt-4 mb-4 rounded-2xl bg-white/20 p-4 text-white">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-blue-200 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Plans ─────────────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2">Our Plans</h2>
            <p className="text-center text-gray-500 mb-2">
              No hardware purchase. Ever. We own and maintain everything.
            </p>
            <p className="text-center text-xs text-gray-400 mb-8">
              Grid backup billed separately at ₹7/kWh (DISCOM rate)
            </p>

            {/* Billing toggle */}
            <div className="flex justify-center mb-10">
              <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1">
                {['monthly', 'annual'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                      billing === b
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {b === 'monthly' ? 'Monthly' : 'Annual (Save 10%)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <PlanCard key={plan.name} plan={plan} billing={billing} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-3">What Our Customers Say</h2>
            <p className="text-center text-gray-500 mb-12">
              Real savings, real stories from across India
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map(({ name, city, plan, stars, text }) => (
                <div
                  key={name}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <StarRating count={stars} />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
                    "{text}"
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-xs font-bold text-white shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">{city} · {plan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── IntelliSmart Admin Portal — DO NOT MODIFY ─────────────────────
           This section is managed separately. Preserved exactly as original.
      ──────────────────────────────────────────────────────────────────── */}
      <section className="py-6 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm mb-2">Are you an IntelliSmart operator?</p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold border border-green-400/30 hover:border-green-300/50 rounded-lg px-4 py-2 transition-all"
        >
          ⚡ IntelliSmart Admin Portal →
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
