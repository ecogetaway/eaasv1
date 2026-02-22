import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

const ALERTS = [
  {
    id: 1,
    type: 'success',
    title: 'Solar peak output achieved',
    detail: 'Your system hit 4.2 kW at 12:30 PM — highest this month.',
    time: '22 Feb 2026, 12:30 PM',
    icon: CheckCircle2,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    badge: 'SUCCESS',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Battery below 20% expected tonight',
    detail: 'High consumption forecasted after 9 PM. Consider reducing AC usage.',
    time: '22 Feb 2026, 06:15 PM',
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    badge: 'WARNING',
  },
  {
    id: 3,
    type: 'info',
    title: 'Bill generated for November',
    detail: 'Your November bill of ₹2,499 is ready. Due by 10 Dec 2024.',
    time: '01 Dec 2024, 09:00 AM',
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    badge: 'INFO',
  },
];

const LiveAlertsPanel = () => {
  const [dismissed, setDismissed] = useState([]);

  const visible = ALERTS.filter((a) => !dismissed.includes(a.id));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
        {visible.length > 0 && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
            {visible.length}
          </span>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 size={32} className="text-green-400 mb-2" />
          <p className="text-sm text-gray-500">All clear — no active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(({ id, icon: Icon, title, detail, time, bg, border, iconColor, badgeBg, badgeText, badge }) => (
            <div
              key={id}
              className={`relative rounded-xl border ${bg} ${border} p-4`}
            >
              <button
                onClick={() => setDismissed((d) => [...d, id])}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-3 pr-5">
                <Icon size={18} className={`${iconColor} shrink-0 mt-0.5`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${badgeBg} ${badgeText}`}>
                      {badge}
                    </span>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveAlertsPanel;
