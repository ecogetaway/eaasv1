import pool from '../config/database.js';
import moment from 'moment';

export const getCurrentEnergy = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;

    // Get latest reading
    const result = await pool.query(
      `SELECT * FROM energy_data 
       WHERE user_id = $1 
       ORDER BY timestamp DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No energy data found' });
    }

    // Ensure numeric values are properly formatted
    const data = result.rows[0];
    const formattedData = {
      ...data,
      solar_generation: parseFloat(data.solar_generation || 0),
      grid_import: parseFloat(data.grid_import || 0),
      grid_export: parseFloat(data.grid_export || 0),
      battery_charge: parseFloat(data.battery_charge || 0),
      battery_discharge: parseFloat(data.battery_discharge || 0),
      total_consumption: parseFloat(data.total_consumption || 0),
      voltage: parseFloat(data.voltage || 0),
      frequency: parseFloat(data.frequency || 0),
      power_factor: parseFloat(data.power_factor || 0),
    };

    res.json({ data: formattedData });
  } catch (error) {
    next(error);
  }
};

export const getEnergyHistory = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { period = 'day', startDate, endDate } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = moment(startDate).startOf('day');
      end = moment(endDate).endOf('day');
    } else {
      // Default to period-based query
      end = moment().endOf('day');
      switch (period) {
        case 'day':
          start = moment().startOf('day');
          break;
        case 'week':
          start = moment().subtract(7, 'days').startOf('day');
          break;
        case 'month':
          start = moment().subtract(30, 'days').startOf('day');
          break;
        case 'year':
          start = moment().subtract(365, 'days').startOf('day');
          break;
        default:
          start = moment().startOf('day');
      }
    }

    // For day view, return hourly aggregated data
    // For week/month view, return daily aggregated data
    let groupBy = 'DATE(timestamp)';
    let timestampFormat = 'YYYY-MM-DD';

    if (period === 'day') {
      groupBy = "DATE_TRUNC('hour', timestamp)";
      timestampFormat = 'YYYY-MM-DD HH:mm:ss';
    }

    const result = await pool.query(
      `SELECT 
        ${groupBy} as timestamp,
        COALESCE(SUM(solar_generation), 0) as solar_generation,
        COALESCE(SUM(grid_import), 0) as grid_import,
        COALESCE(SUM(grid_export), 0) as grid_export,
        COALESCE(AVG(battery_charge), 0) as battery_charge,
        COALESCE(SUM(total_consumption), 0) as total_consumption
       FROM energy_data
       WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3
       GROUP BY ${groupBy}
       ORDER BY timestamp ASC`,
      [userId, start.toISOString(), end.toISOString()]
    );

    // Format data to ensure numeric values and proper timestamp format
    const formattedData = result.rows.map(row => {
      // Convert timestamp to ISO string for consistent parsing
      let timestamp = row.timestamp;
      if (timestamp instanceof Date) {
        timestamp = timestamp.toISOString();
      } else if (typeof timestamp === 'string') {
        // Ensure it's a valid ISO string
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          timestamp = date.toISOString();
        }
      }
      
      return {
        ...row,
        timestamp: timestamp,
        solar_generation: parseFloat(row.solar_generation || 0) || 0,
        grid_import: parseFloat(row.grid_import || 0) || 0,
        grid_export: parseFloat(row.grid_export || 0) || 0,
        battery_charge: parseFloat(row.battery_charge || 0) || 0,
        total_consumption: parseFloat(row.total_consumption || 0) || 0,
      };
    });

    res.json({
      period,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const today = moment().startOf('day');
    const monthStart = moment().startOf('month');

    // Today's summary
    const todayResult = await pool.query(
      `SELECT 
        SUM(solar_generation) as solar_units,
        SUM(total_consumption) as total_consumption,
        SUM(grid_import) as grid_import,
        SUM(grid_export) as grid_export
       FROM energy_data
       WHERE user_id = $1 AND timestamp >= $2`,
      [userId, today.toISOString()]
    );

    // This month's summary
    const monthResult = await pool.query(
      `SELECT 
        SUM(solar_generation) as solar_units,
        SUM(total_consumption) as total_consumption,
        SUM(grid_import) as grid_import,
        SUM(grid_export) as grid_export
       FROM energy_data
       WHERE user_id = $1 AND timestamp >= $2`,
      [userId, monthStart.toISOString()]
    );

    const todayData = todayResult.rows[0] || {};
    const monthData = monthResult.rows[0] || {};

    // Parse values safely, defaulting to 0 if null/undefined/NaN
    const todaySolar = parseFloat(todayData.solar_units || 0) || 0;
    const todayConsumption = parseFloat(todayData.total_consumption || 0) || 0;
    const todayGridImport = parseFloat(todayData.grid_import || 0) || 0;
    const todayGridExport = parseFloat(todayData.grid_export || 0) || 0;

    const monthSolar = parseFloat(monthData.solar_units || 0) || 0;
    const monthConsumption = parseFloat(monthData.total_consumption || 0) || 0;
    const monthGridImport = parseFloat(monthData.grid_import || 0) || 0;
    const monthGridExport = parseFloat(monthData.grid_export || 0) || 0;

    // Calculate savings (export credit - import cost)
    const todaySavings = Math.max(0, (todayGridExport * 5.0) - (todayGridImport * 7.5));
    const monthSavings = Math.max(0, (monthGridExport * 5.0) - (monthGridImport * 7.5));

    // Calculate carbon offset (kg CO2 per kWh)
    const todayCarbon = todaySolar * 0.8;
    const monthCarbon = monthSolar * 0.8;

    res.json({
      today: {
        solar_units: parseFloat(todaySolar.toFixed(2)),
        total_consumption: parseFloat(todayConsumption.toFixed(2)),
        savings: parseFloat(todaySavings.toFixed(2)),
        carbon_offset: parseFloat(todayCarbon.toFixed(2)),
      },
      month: {
        solar_units: parseFloat(monthSolar.toFixed(2)),
        total_consumption: parseFloat(monthConsumption.toFixed(2)),
        savings: parseFloat(monthSavings.toFixed(2)),
        carbon_offset: parseFloat(monthCarbon.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

