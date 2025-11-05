import pool from '../config/database.js';
import { SIMULATOR_CONFIG } from '../config/constants.js';
import moment from 'moment';

class IoTSimulator {
  constructor() {
    this.intervals = new Map(); // Store intervals per user
  }

  // Generate realistic energy reading for a user
  generateReading(userId, subscription) {
    const now = moment();
    const hour = now.hour();
    const solarCapacity = parseFloat(subscription.installation_capacity);
    const batteryCapacity = parseFloat(subscription.battery_capacity || 0);

    // Solar generation follows sun curve (0 at night, peaks at noon)
    let solarGeneration = 0;
    if (hour >= 6 && hour <= 18) {
      const peakHour = SIMULATOR_CONFIG.SOLAR_PEAK_HOUR;
      const distanceFromPeak = Math.abs(hour - peakHour);
      const maxIntensity = Math.max(0, 1 - (distanceFromPeak / 7));
      const baseGeneration = solarCapacity * maxIntensity;
      // Add random variation (±10%)
      const variation = (Math.random() - 0.5) * SIMULATOR_CONFIG.VARIATION_PERCENT * 2;
      solarGeneration = baseGeneration * (1 + variation);
      solarGeneration = Math.max(0, solarGeneration);
    }

    // Consumption peaks at morning (7-9 AM) and evening (6-9 PM)
    let baseConsumption = solarCapacity * 0.3; // Base consumption
    if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 21)) {
      baseConsumption = solarCapacity * 0.8; // Peak consumption
    }
    const consumptionVariation = (Math.random() - 0.5) * SIMULATOR_CONFIG.VARIATION_PERCENT * 2;
    const consumption = baseConsumption * (1 + consumptionVariation);
    const totalConsumption = Math.max(0, consumption);

    // Get last battery state
    return this.getLastBatteryState(userId, batteryCapacity).then((lastBatteryCharge) => {
      let gridImport = 0;
      let gridExport = 0;
      let batteryCharge = lastBatteryCharge || 0;
      let batteryLevel = batteryCharge;

      if (solarGeneration > totalConsumption) {
        const excess = solarGeneration - totalConsumption;
        if (batteryCapacity > 0) {
          // Charge battery first
          const maxCharge = batteryCapacity * 0.9; // Max 90% charge
          const chargeAmount = Math.min(excess, maxCharge - batteryCharge);
          batteryLevel = Math.min(maxCharge, batteryCharge + chargeAmount);
          
          // Export remaining excess
          gridExport = excess - chargeAmount;
        } else {
          gridExport = excess;
        }
      } else {
        const deficit = totalConsumption - solarGeneration;
        if (batteryCapacity > 0 && batteryCharge > 0) {
          // Discharge battery
          const dischargeAmount = Math.min(deficit, batteryCharge);
          batteryLevel = batteryCharge - dischargeAmount;
          gridImport = deficit - dischargeAmount;
        } else {
          gridImport = deficit;
        }
      }

      return {
        user_id: userId,
        timestamp: now.toISOString(),
        solar_generation: parseFloat(solarGeneration.toFixed(2)),
        grid_import: parseFloat(Math.max(0, gridImport).toFixed(2)),
        grid_export: parseFloat(Math.max(0, gridExport).toFixed(2)),
        battery_charge: parseFloat(Math.max(0, batteryLevel).toFixed(2)),
        battery_capacity: batteryCapacity,
        total_consumption: parseFloat(totalConsumption.toFixed(2)),
      };
    });
  }

  // Get last battery charge state from database
  async getLastBatteryState(userId, batteryCapacity) {
    try {
      const result = await pool.query(
        `SELECT battery_charge FROM energy_data 
         WHERE user_id = $1 
         ORDER BY timestamp DESC LIMIT 1`,
        [userId]
      );
      return result.rows[0]?.battery_charge || 0;
    } catch (error) {
      console.error('Error getting battery state:', error);
      return 0;
    }
  }

  // Store reading in database
  async storeReading(reading) {
    try {
      await pool.query(
        `INSERT INTO energy_data (user_id, timestamp, solar_generation, grid_import, grid_export, battery_charge, total_consumption, voltage, frequency, power_factor)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          reading.user_id,
          reading.timestamp,
          reading.solar_generation,
          reading.grid_import,
          reading.grid_export,
          reading.battery_charge,
          reading.total_consumption,
          reading.voltage || 230, // Default voltage
          reading.frequency || 50, // Default frequency
          reading.power_factor || 0.95, // Default power factor
        ]
      );
      return reading;
    } catch (error) {
      console.error('Error storing energy reading:', error);
      throw error;
    }
  }

  // Start simulating for a user
  async startSimulation(userId, subscription, io) {
    // Stop existing simulation if any
    this.stopSimulation(userId);

    // Generate initial reading
    const reading = await this.generateReading(userId, subscription);
    await this.storeReading(reading);

    // Emit initial reading
    if (io) {
      io.to(`user_${userId}`).emit('energy_update', reading);
    }

    // Start interval
    const interval = setInterval(async () => {
      try {
        const newReading = await this.generateReading(userId, subscription);
        await this.storeReading(newReading);

        // Emit via WebSocket
        if (io) {
          io.to(`user_${userId}`).emit('energy_update', newReading);
        }
      } catch (error) {
        console.error(`Error in simulation for user ${userId}:`, error);
      }
    }, SIMULATOR_CONFIG.UPDATE_INTERVAL);

    this.intervals.set(userId, interval);
    console.log(`✅ Started IoT simulation for user ${userId}`);
  }

  // Stop simulation for a user
  stopSimulation(userId) {
    const interval = this.intervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(userId);
      console.log(`⏹️  Stopped IoT simulation for user ${userId}`);
    }
  }

  // Stop all simulations
  stopAll() {
    this.intervals.forEach((interval, userId) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    console.log('⏹️  Stopped all IoT simulations');
  }
}

export default new IoTSimulator();

