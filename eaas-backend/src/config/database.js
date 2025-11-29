import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// SSL configuration for Supabase
// Always use SSL for Supabase connections and handle self-signed certificates
const isSupabase = process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('pooler.supabase.com');
const isProduction = process.env.NODE_ENV === 'production';

// For Supabase, we MUST use SSL but accept self-signed certificates
// The rejectUnauthorized: false is critical for Supabase's self-signed certs
const sslConfig = (isSupabase || isProduction) 
  ? { 
      rejectUnauthorized: false,  // Accept self-signed certificates from Supabase
      require: true               // Require SSL connection
    } 
  : false;

console.log('Database SSL Config:', { isSupabase, isProduction, sslConfig: sslConfig ? 'enabled' : 'disabled' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});

export default pool;

