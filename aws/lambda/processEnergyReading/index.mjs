/**
 * AWS Lambda — processEnergyReading
 *
 * Triggered by: AWS IoT Core Rule
 *   SQL: SELECT *, topic(3) AS meterId FROM 'eaas/meters/+/reading'
 *
 * Flow:
 *   IntelliSmart Smart Meter (or IoT Simulator)
 *       → MQTT publish → AWS IoT Core
 *       → IoT Rule fires this Lambda
 *       → Writes to DynamoDB (hot path, <10ms)
 *       → Optionally posts to SNS for anomaly detection
 *
 * Runtime: Node.js 20.x
 * Memory: 128 MB (default)
 * Timeout: 10 seconds
 * Region: ap-south-1 (Mumbai) — co-located with IoT Core endpoint
 *
 * IAM Role needs:
 *   - dynamodb:PutItem on arn:aws:dynamodb:ap-south-1:*:table/eaas-energy-readings
 *   - logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents (CloudWatch)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: 'ap-south-1' })
);

const TABLE = process.env.DYNAMODB_TABLE || 'eaas-energy-readings';
const TTL_SECONDS = 90 * 24 * 3600; // 90 days retention

export const handler = async (event) => {
  console.log('IoT Reading received:', JSON.stringify(event));

  const {
    userId,
    meterId,
    timestamp,
    solar_generation,
    grid_import,
    grid_export,
    battery_charge,
    total_consumption,
    voltage,
    frequency,
    power_factor,
    source,
  } = event;

  if (!userId || !timestamp) {
    console.error('Missing required fields: userId or timestamp');
    return { statusCode: 400, body: 'Missing userId or timestamp' };
  }

  const ttl = Math.floor(Date.now() / 1000) + TTL_SECONDS;

  try {
    await client.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          // Primary key
          userId,                           // Partition key
          timestamp,                        // Sort key (ISO-8601)

          // Meter identity
          meterId: meterId || 'unknown',

          // Energy readings (kW)
          solar_generation: Number(solar_generation ?? 0),
          grid_import:      Number(grid_import      ?? 0),
          grid_export:      Number(grid_export      ?? 0),
          battery_charge:   Number(battery_charge   ?? 0),
          total_consumption:Number(total_consumption?? 0),

          // Electrical parameters
          voltage:      Number(voltage      ?? 230),
          frequency:    Number(frequency    ?? 50.0),
          power_factor: Number(power_factor ?? 0.95),

          // Metadata
          source: source || 'unknown',
          ingested_at: new Date().toISOString(),

          // DynamoDB TTL — auto-deletes after 90 days
          ttl,
        },
      })
    );

    console.log(`[DynamoDB ✓] Stored reading for ${userId} at ${timestamp}`);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('[DynamoDB ✗] Write failed:', err);
    throw err; // Lambda will retry (up to 2x based on IoT Rule retry config)
  }
};
