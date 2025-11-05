# Quick Start Guide

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check PostgreSQL
psql --version

# Check Redis
redis-cli --version
```

## 5-Minute Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create database**
   ```bash
   createdb eaas_db
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run migrations**
   ```bash
   npm run migrate
   ```

5. **Seed database**
   ```bash
   npm run seed
   ```

6. **Start server**
   ```bash
   npm run dev
   ```

## Test the API

```bash
# Health check
curl http://localhost:5000/health

# Login with demo user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo1@eaas.com","password":"Demo@123"}'

# Get plans (use token from login response)
curl http://localhost:5000/api/subscriptions/plans \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Demo Credentials

All demo users use password: `Demo@123`

- demo1@eaas.com
- demo2@eaas.com
- demo3@eaas.com
- demo4@eaas.com
- demo5@eaas.com

## Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env

**Redis connection error:**
- Check Redis is running: `redis-cli ping`
- Should return `PONG`

**Port already in use:**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill`

## Next Steps

1. Test WebSocket connection with frontend
2. Verify real-time energy updates
3. Test billing and invoice generation
4. Test support ticket creation

