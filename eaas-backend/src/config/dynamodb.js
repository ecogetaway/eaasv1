/**
 * Amazon DynamoDB Configuration
 *
 * Used for high-frequency energy readings — the "hot path" data store.
 *
 * Why DynamoDB for energy readings?
 *   - PostgreSQL on one node: ~225 writes/sec at 67K homes (5-min interval)
 *   - DynamoDB: millions of writes/sec, no config changes, auto-scales
 *   - 90-day TTL keeps the table lean (archive older data to S3 Glacier)
 *
 * Table: eaas-energy-readings
 *   Partition key: userId  (string)
 *   Sort key:      timestamp (ISO-8601 string)
 *   TTL attribute: ttl (Unix epoch seconds, 90 days)
 *
 * Billing mode: PAY_PER_REQUEST (no provisioning, free tier: 200M requests/month)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'ap-south-1';

const rawClient = new DynamoDBClient({
  region: REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined, // Falls back to EC2/ECS/Lambda instance role in production
});

// Document client: marshals/unmarshals JS objects ↔ DynamoDB AttributeValues
const dynamodb = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'eaas-energy-readings';
export const TTL_DAYS = 90;

export default dynamodb;
