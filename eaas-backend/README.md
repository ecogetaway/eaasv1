# Energy-as-a-Service (EaaS) Backend API

A complete backend API for an Energy-as-a-Service platform built with Node.js, Express, PostgreSQL, Redis, and Socket.io.

## Features

- 🔐 JWT Authentication
- 📊 Real-time Energy Data Tracking (WebSocket)
- 💰 Automated Billing & Invoice Generation
- 🎫 Support Ticket System
- 🔌 IoT Data Simulator
- 📄 PDF Invoice Generation
- 📧 Email Notifications (Mock)

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT
- **PDF Generation**: PDFKit

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

## Installation

1. **Clone the repository**
   ```bash
   cd eaas-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eaas_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   UPLOAD_DIR=./uploads
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb eaas_db
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Seed database with demo data**
   ```bash
   npm run seed
   ```

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)

### Subscriptions
- `GET /api/subscriptions/plans` - Get all plans
- `GET /api/subscriptions/plans/:planId` - Get plan by ID
- `GET /api/subscriptions/plans/recommend?monthlyBill=3000` - Get recommended plan
- `POST /api/subscriptions` - Create subscription (auth required)
- `GET /api/subscriptions/user/:userId` - Get user subscriptions (auth required)
- `GET /api/subscriptions/:subscriptionId` - Get subscription by ID (auth required)

### Energy Data
- `GET /api/energy/current/:userId` - Get current energy reading (auth required)
- `GET /api/energy/history/:userId?period=day|week|month` - Get energy history (auth required)
- `GET /api/energy/dashboard/summary/:userId` - Get dashboard summary (auth required)

### Billing
- `GET /api/bills/user/:userId` - Get all user bills (auth required)
- `GET /api/bills/current/:userId` - Get current month provisional bill (auth required)
- `GET /api/bills/:billId` - Get bill by ID (auth required)
- `GET /api/bills/:billId/invoice` - Download invoice PDF (auth required)
- `POST /api/bills/:billId/pay` - Process payment (auth required)

### Support Tickets
- `POST /api/tickets` - Create ticket (auth required)
- `GET /api/tickets/user/:userId?status=open` - Get user tickets (auth required)
- `GET /api/tickets/:ticketId` - Get ticket details (auth required)
- `POST /api/tickets/:ticketId/reply` - Add reply to ticket (auth required)
- `PUT /api/tickets/:ticketId/status` - Update ticket status (auth required)

## WebSocket API

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Events

**Client → Server:**
- `subscribe_user` - Subscribe to user's energy updates
  ```javascript
  socket.emit('subscribe_user', userId);
  ```

- `unsubscribe_user` - Unsubscribe from user's energy updates
  ```javascript
  socket.emit('unsubscribe_user', userId);
  ```

**Server → Client:**
- `energy_update` - Real-time energy data (emitted every 5 seconds)
  ```javascript
  socket.on('energy_update', (data) => {
    console.log('Energy update:', data);
  });
  ```

## Demo Users

After running the seed script, you can use these demo accounts:

| Email | Password | Description |
|-------|----------|-------------|
| demo1@eaas.com | Demo@123 | Residential (2kW solar) |
| demo2@eaas.com | Demo@123 | Business (5kW solar + 10kWh battery) |
| demo3@eaas.com | Demo@123 | Apartment (2kW solar) |
| demo4@eaas.com | Demo@123 | Residential (3kW solar + 5kWh battery) |
| demo5@eaas.com | Demo@123 | Residential (3kW solar + 5kWh battery) |

## Database Schema

### Tables
- `users` - User accounts
- `plan_catalog` - Available subscription plans
- `subscriptions` - User subscriptions
- `energy_data` - Energy readings (indexed on user_id + timestamp)
- `bills` - Monthly bills
- `payments` - Payment records
- `support_tickets` - Support tickets
- `ticket_updates` - Ticket conversation updates

## IoT Simulator

The backend includes an IoT simulator that generates realistic energy data:
- Solar generation follows sun curve (peaks at noon)
- Consumption peaks at morning (7-9 AM) and evening (6-9 PM)
- Battery charges during excess solar, discharges at night
- Grid import/export calculated automatically
- Data updated every 5 seconds
- Stores readings in PostgreSQL

## Project Structure

```
src/
├── config/          # Database, Redis, constants
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # Database models (if needed)
├── routes/          # API routes
├── services/        # Business logic (IoT, billing, PDF, email)
├── scripts/         # Migration and seed scripts
├── utils/           # Helper functions
└── server.js        # Main entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Deployment

### Railway

1. Create a new Railway project
2. Add PostgreSQL and Redis services
3. Set environment variables
4. Deploy from Git or Railway CLI

### Render

1. Create a new Web Service
2. Connect your Git repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add PostgreSQL and Redis databases
6. Set environment variables

### Heroku

1. Create Heroku app
2. Add PostgreSQL and Redis add-ons
3. Set environment variables
4. Deploy using Git

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with demo data

## Testing

Use Postman, curl, or any HTTP client to test the API:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo1@eaas.com","password":"Demo@123"}'

# Get plans (requires auth token)
curl http://localhost:5000/api/subscriptions/plans \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## License

ISC

## Support

For issues or questions, please contact support@eaas.com

