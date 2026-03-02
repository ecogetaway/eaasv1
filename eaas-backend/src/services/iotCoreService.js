/**
 * AWS IoT Core Service
 *
 * Publishes smart meter readings to AWS IoT Core via the HTTP/HTTPS Data API.
 * No MQTT client library needed — standard HTTPS + SigV4 signing (AWS SDK handles it).
 *
 * MQTT topic schema: eaas/meters/{meterId}/reading
 *
 * IoT Flow:
 *   iotSimulator.js
 *       → publishMeterReading()            (this file)
 *       → IoT Core HTTP Publish API
 *       → IoT Rule (SQL filter)
 *       → AWS Lambda  (aws/lambda/processEnergyReading/index.mjs)
 *       → DynamoDB    (eaas-energy-readings table)
 *
 * Graceful fallback: If AWS_IOT_ENDPOINT is not set, logs a simulated
 * publish so the demo never breaks without credentials.
 */

import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const IOT_ENDPOINT = process.env.AWS_IOT_ENDPOINT; // e.g. abcdefg123-ats.iot.ap-south-1.amazonaws.com

// Build client only when endpoint is configured
const iotClient = IOT_ENDPOINT
  ? new IoTDataPlaneClient({
      region: REGION,
      endpoint: `https://${IOT_ENDPOINT}`,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Publish a smart meter reading to IoT Core.
 *
 * @param {string} meterId    - e.g. "meter_123" (maps to an IntelliSmart meter serial)
 * @param {object} reading    - energy reading from iotSimulator
 * @returns {Promise<boolean>} true if published to real IoT Core, false if simulated
 */
export const publishMeterReading = async (meterId, reading) => {
  const topic = `eaas/meters/${meterId}/reading`;

  const payload = {
    meterId,
    userId: reading.user_id,
    timestamp: reading.timestamp || new Date().toISOString(),
    solar_generation: reading.solar_generation,
    grid_import: reading.grid_import,
    grid_export: reading.grid_export,
    battery_charge: reading.battery_charge,
    total_consumption: reading.total_consumption,
    voltage: reading.voltage || 230,
    frequency: reading.frequency || 50.0,
    power_factor: reading.power_factor || 0.95,
    source: 'eaas-iot-simulator-v1',
    // In production: source would be 'intellismart-meter-v2' from real hardware
  };

  if (!iotClient) {
    // Mock mode — credentials not configured. Log and skip (demo stays alive).
    console.log(`[IoT Core MOCK] → ${topic}`, {
      solar: `${payload.solar_generation} kW`,
      grid_import: `${payload.grid_import} kW`,
      battery: `${payload.battery_charge} kWh`,
    });
    return false;
  }

  try {
    const command = new PublishCommand({
      topic,
      qos: 1, // QoS 1: at-least-once delivery
      payload: Buffer.from(JSON.stringify(payload)),
    });

    await iotClient.send(command);
    console.log(`[IoT Core ✓] Published to ${topic}`);
    return true;
  } catch (err) {
    // Non-fatal: log but don't crash the simulation loop
    console.error(`[IoT Core ✗] Failed to publish to ${topic}:`, err.message);
    return false;
  }
};

/**
 * Map a userId → meterId.
 * In production: query the meters table for the user's actual IntelliSmart serial.
 * Here we use a predictable deterministic mapping for the demo.
 *
 * @param {string} userId
 * @returns {string} meterId
 */
export const getMeterId = (userId) => {
  // Demo mapping: user_123 → meter_123
  // Production: SELECT meter_number FROM meters WHERE user_id = $1
  return `meter_${userId.replace('user_', '')}`;
};

export default { publishMeterReading, getMeterId };
