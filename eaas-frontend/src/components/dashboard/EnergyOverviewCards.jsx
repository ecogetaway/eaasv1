import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sun, Battery, Leaf, PiggyBank } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
    <div className={`${iconBg} rounded-xl p-3 shrink-0`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500 truncate">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

const EnergyOverviewCards = ({ currentEnergy, dashboardSummary, subscription }) => {
  // Live fluctuating values
  const [liveUsage, setLiveUsage] = useState(2.00);
  const [liveSolar, setLiveSolar] = useState(2.42);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLiveUsage((prev) => {
        const delta = (Math.random() - 0.5) * 0.1; // ±0.05
        return Math.max(0.5, Math.min(5, parseFloat((prev + delta).toFixed(2))));
      });
      setLiveSolar((prev) => {
        const delta = (Math.random() - 0.5) * 0.06; // ±0.03
        return Math.max(0, Math.min(5, parseFloat((prev + delta).toFixed(2))));
      });
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Battery: display as "X.XX / Y kWh" — fixed format
  const batteryCapacity = subscription?.battery_capacity || 5;
  const batteryLevel = 83; // percent
  const batteryUsed = parseFloat(((batteryLevel / 100) * batteryCapacity).toFixed(2));
  const batteryDisplay = `${batteryUsed} / ${batteryCapacity} kWh`;

  // CO₂ offset
  const co2 = dashboardSummary?.today?.co2_saved || 173;

  const cards = [
    {
      title: 'Real-time Usage',
      value: `${liveUsage} kW`,
      subtitle: 'Same as yesterday',
      icon: TrendingUp,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Solar Generation',
      value: `${liveSolar} kW`,
      subtitle: 'Peak production active',
      icon: Sun,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Battery Level',
      value: `${batteryLevel}%`,
      subtitle: `${batteryDisplay} · Est. 2.1h backup`,
      icon: Battery,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'CO₂ Offset',
      value: `${co2} kg`,
      subtitle: 'This month total',
      icon: Leaf,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: "Today's Savings",
      value: '₹47.20',
      subtitle: 'vs pure grid rate today',
      icon: PiggyBank,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default EnergyOverviewCards;
