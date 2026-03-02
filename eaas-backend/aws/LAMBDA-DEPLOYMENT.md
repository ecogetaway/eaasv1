# EaaS Backend — Lambda + API Gateway Deployment

**Time:** ~45 minutes  
**Cost:** ~$0/month (free tier: 1M requests, 400K GB-seconds)

---

## Prerequisites

- AWS CLI configured (`aws configure`)
- Node.js 20.x
- AWS SAM CLI (`brew install aws-sam-cli` or [install](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))

---

## Step 1: Prepare environment variables

Create `eaas-backend/samconfig.toml` (or pass at deploy time):

```toml
version = 0.1

[default.deploy.parameters]
stack_name = "eaas-api"
region = "ap-south-1"
parameter_overrides = [
  "DatabaseUrl=postgresql://user:pass@host:5432/eaas",
  "JwtSecret=your_jwt_secret_min_32_chars",
  "FrontendUrl=https://eaasv1.netlify.app"
]
capabilities = "CAPABILITY_IAM"
```

Or use an existing Supabase/Railway PostgreSQL URL for `DatabaseUrl`.

---

## Step 2: Build and deploy with SAM

```bash
cd eaas-backend

# Build (installs deps, packages for Lambda)
sam build

# Deploy (creates/updates CloudFormation stack)
sam deploy --guided
# First time: answer prompts (stack name, region, confirm changes)
# Subsequent: sam deploy
```

---

## Step 3: Get the API URL

After deploy, SAM outputs:

```
Outputs
  Key                 ApiUrl
  Description         API Gateway endpoint URL
  Value               https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/Prod/
```

Use this as `VITE_API_URL` in your frontend (add `/api` if your routes expect it).

**Frontend .env.production:**
```
VITE_API_URL=https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/Prod/api
VITE_WS_URL=wss://eaasv1.netlify.app
```

> **Note:** WebSocket (Socket.io) is not on Lambda. The frontend uses mock real-time data (`USE_MOCK_DATA=true` in socketService). For production WebSocket, use API Gateway WebSocket API + Lambda (separate setup).

---

## Step 4: Add AWS resources (S3, IoT) to Lambda

If using S3, IoT Core, etc., add these to the Lambda's environment in `template.yaml`:

```yaml
Environment:
  Variables:
    AWS_S3_BUCKET: eaas-ticket-attachments
    AWS_IOT_ENDPOINT: xxxxx-ats.iot.ap-south-1.amazonaws.com
    DYNAMODB_TABLE: eaas-energy-readings
```

The Lambda execution role needs IAM permissions for:
- `s3:PutObject`, `s3:GetObject` (if using S3)
- `iot:Publish` (if using IoT Core)
- `dynamodb:PutItem` (if using DynamoDB)

Add to `template.yaml` under the Function:

```yaml
Policies:
  - Version: '2012-10-17'
    Statement:
      - Effect: Allow
        Action: s3:PutObject
        Resource: arn:aws:s3:::eaas-ticket-attachments/*
      - Effect: Allow
        Action: iot:Publish
        Resource: arn:aws:iot:ap-south-1:*:topic/eaas/meters/*/reading
```

---

## Alternative: Manual zip deploy (no SAM)

```bash
cd eaas-backend
npm install --production
zip -r function.zip . -x "*.git*" -x "node_modules/aws-sdk/*"
aws lambda update-function-code --function-name eaas-api --zip-file fileb://function.zip \
  --region ap-south-1
```

Create the function first via Console or AWS CLI:

```bash
aws lambda create-function \
  --function-name eaas-api \
  --runtime nodejs20.x \
  --handler src/lambda.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --environment Variables="{DATABASE_URL=...,JWT_SECRET=...}" \
  --timeout 29 \
  --memory-size 1024 \
  --region ap-south-1
```

Then create API Gateway HTTP API and add a Lambda integration for `ANY /{proxy+}`.

---

## Database: Supabase vs RDS

| Option | Lambda setup | Cost |
|--------|--------------|------|
| **Supabase** | Use DATABASE_URL in env, no VPC | Free tier |
| **RDS (public)** | Use DATABASE_URL, no VPC | ~$15/mo |
| **RDS (private)** | Lambda in VPC, subnet, security group | ~$15/mo + config |

For hackathon: Supabase or existing Railway Postgres is simplest.

---

## Cost estimate ($200 credits)

| Service | Monthly (67K homes demo) |
|---------|--------------------------|
| Lambda | ~$0 (1M requests free) |
| API Gateway | ~$0 (1M requests free) |
| **Total** | **$0** |

$200 credits ≈ 6–8 months of full usage.
