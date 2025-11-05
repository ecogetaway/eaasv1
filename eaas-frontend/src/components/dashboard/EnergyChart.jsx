import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDate, formatKW, formatKWh } from '../../utils/formatters.js';

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444'];

const EnergyChart = ({ energyHistory, period = 'day' }) => {
  const [chartType, setChartType] = useState('line');

  if (!energyHistory || energyHistory.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  // Format data for charts
  const chartData = energyHistory.map((item) => {
    // Handle timestamp parsing - ensure it's a Date object
    let timestamp;
    try {
      if (item.timestamp instanceof Date) {
        timestamp = item.timestamp;
      } else if (typeof item.timestamp === 'string') {
        timestamp = new Date(item.timestamp);
        if (isNaN(timestamp.getTime())) {
          console.warn('Invalid timestamp:', item.timestamp);
          timestamp = new Date(); // Fallback to current time
        }
      } else {
        timestamp = new Date(); // Fallback
      }
    } catch (error) {
      console.error('Error parsing timestamp:', error, item.timestamp);
      timestamp = new Date();
    }
    
    // Format time label based on period
    let timeLabel;
    try {
      if (period === 'day') {
        timeLabel = timestamp.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        timeLabel = timestamp.toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      timeLabel = timestamp.toISOString();
    }

    return {
      time: timeLabel,
      timestamp: timestamp,
      solar: parseFloat(item.solar_generation || 0) || 0,
      consumption: parseFloat(item.total_consumption || 0) || 0,
      gridImport: parseFloat(item.grid_import || 0) || 0,
      gridExport: parseFloat(item.grid_export || 0) || 0,
      battery: parseFloat(item.battery_charge || 0) || 0,
    };
  }).filter(item => item.timestamp instanceof Date && !isNaN(item.timestamp.getTime())); // Filter out invalid dates

  // Calculate energy distribution for pie chart
  const totalSolar = chartData.reduce((sum, d) => sum + d.solar, 0);
  const totalGrid = chartData.reduce((sum, d) => sum + d.gridImport, 0);
  const totalBattery = chartData.reduce((sum, d) => sum + d.battery, 0);
  const totalConsumption = chartData.reduce((sum, d) => sum + d.consumption, 0);

  const pieData = [
    { name: 'Solar', value: totalSolar },
    { name: 'Grid', value: totalGrid },
    { name: 'Battery', value: totalBattery },
  ].filter(item => item.value > 0);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Energy Analytics</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'line' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'area' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'bar' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'pie' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' && (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="solar"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Solar (kW)"
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Consumption (kW)"
            />
          </LineChart>
        )}

        {chartType === 'area' && (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="solar"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              name="Solar"
            />
            <Area
              type="monotone"
              dataKey="gridImport"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              name="Grid Import"
            />
            <Area
              type="monotone"
              dataKey="battery"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Battery"
            />
          </AreaChart>
        )}

        {chartType === 'bar' && (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="solar" fill="#f59e0b" name="Solar" />
            <Bar dataKey="consumption" fill="#0ea5e9" name="Consumption" />
            <Bar dataKey="gridImport" fill="#ef4444" name="Grid Import" />
            <Bar dataKey="gridExport" fill="#10b981" name="Grid Export" />
          </BarChart>
        )}

        {chartType === 'pie' && (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;

