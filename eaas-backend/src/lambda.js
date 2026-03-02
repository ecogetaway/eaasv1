/**
 * AWS Lambda handler — wraps Express app for API Gateway
 *
 * Deploy: See aws/LAMBDA-DEPLOYMENT.md
 * API Gateway HTTP API (v2) or REST API → Lambda proxy integration
 */
import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';

export const handler = serverlessExpress({ app });
