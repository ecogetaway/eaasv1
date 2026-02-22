import { useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Leaf } from 'lucide-react';

const GridIndependenceScore = ({ dashboardSummary, energyHistory }) => {
  // Fixed score: 78 — Good, above city average
  const score = 78;

  const data = [{ value: score, fill: '#16a34a' }];

  const getScoreLabel = (s) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (s >= 75) return { label: 'Good — above city average', color: 'text-green-500' };
    if (s >= 50) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const { label, color } = getScoreLabel(score);

  // Breakdown stats
  const stats = [
    { label: 'Solar Coverage', value: '74%' },
    { label: 'Battery Utilisation', value: '68%' },
    { label: 'Grid Draw Days', value: '3 / 7' },
    { label: 'City Average Score', value: '61' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={18} className="text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Grid Independence Score</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Your system efficiency compared to neighbourhood average.
      </p>

      {/* Radial gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={225}
              endAngle={-45}
              data={data}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              {/* Background track */}
              <RadialBar
                background={{ fill: '#f3f4f6' }}
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Centre text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-gray-900">{score}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              SCORE
            </span>
          </div>
        </div>

        <p className={`mt-2 text-sm font-semibold ${color}`}>{label}</p>

        {/* Savings callout */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 w-full justify-center">
          <Leaf size={14} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            You saved <span className="font-bold">₹45.20</span> this week by using stored energy.
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map(({ label: l, value }) => (
          <div key={l} className="rounded-lg bg-gray-50 px-3 py-2.5">
            <p className="text-xs text-gray-500">{l}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridIndependenceScore;
