import { Sun, Home, Grid, ArrowUpDown, Battery } from 'lucide-react';
import MetricCard from '../common/MetricCard.jsx';
import { formatKW, formatPercentage } from '../../utils/formatters.js';

const LiveMetrics = ({ currentEnergy, batteryCapacity }) => {
  if (!currentEnergy) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const batteryPercent = batteryCapacity > 0 
    ? formatPercentage(currentEnergy.battery_charge || 0, batteryCapacity)
    : '0%';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Solar Generation"
        value={formatKW(currentEnergy.solar_generation || 0)}
        icon={Sun}
        color="yellow"
        subtitle="Current output"
      />
      <MetricCard
        title="Consumption"
        value={formatKW(currentEnergy.total_consumption || 0)}
        icon={Home}
        color="blue"
        subtitle="Current usage"
      />
      <MetricCard
        title="Grid Import"
        value={formatKW(currentEnergy.grid_import || 0)}
        icon={Grid}
        color="red"
        subtitle="From grid"
      />
      <MetricCard
        title="Grid Export"
        value={formatKW(currentEnergy.grid_export || 0)}
        icon={ArrowUpDown}
        color="green"
        subtitle="To grid"
      />
      <MetricCard
        title="Battery"
        value={batteryPercent}
        icon={Battery}
        color="green"
        subtitle={`${currentEnergy.battery_charge || 0} / ${batteryCapacity || 0} kWh`}
      />
    </div>
  );
};

export default LiveMetrics;

