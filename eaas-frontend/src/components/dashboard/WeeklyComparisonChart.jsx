import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', thisWeek: 18.4, lastWeek: 22.1 },
  { day: 'Tue', thisWeek: 16.8, lastWeek: 20.5 },
  { day: 'Wed', thisWeek: 19.2, lastWeek: 21.3 },
  { day: 'Thu', thisWeek: 15.6, lastWeek: 19.8 },
  { day: 'Fri', thisWeek: 17.9, lastWeek: 23.4 },
  { day: 'Sat', thisWeek: 20.1, lastWeek: 24.6 },
  { day: 'Sun', thisWeek: 14.3, lastWeek: 18.9 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value} kWh
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const WeeklyComparisonChart = () => {
  const thisWeekTotal = weeklyData.reduce((s, d) => s + d.thisWeek, 0).toFixed(1);
  const lastWeekTotal = weeklyData.reduce((s, d) => s + d.lastWeek, 0).toFixed(1);
  const saving = (lastWeekTotal - thisWeekTotal).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Weekly Consumption Comparison</h2>
          <p className="text-sm text-gray-500 mt-0.5">This week vs last week (kWh)</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-center">
            <p className="text-xs text-gray-500">This Week</p>
            <p className="text-sm font-bold text-blue-600">{thisWeekTotal} kWh</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Last Week</p>
            <p className="text-sm font-bold text-gray-500">{lastWeekTotal} kWh</p>
          </div>
          <div className="rounded-xl bg-green-50 px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Saved</p>
            <p className="text-sm font-bold text-green-600">↓ {saving} kWh</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} unit=" kWh" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) =>
              value === 'thisWeek' ? 'This Week' : 'Last Week'
            }
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="thisWeek"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#2563eb' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="lastWeek"
            stroke="#d1d5db"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#9ca3af' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyComparisonChart;
