#!/bin/bash

# Run migration locally using Supabase connection string
# Make sure to set DATABASE_URL first

export DATABASE_URL="postgresql://postgres:Mggd.2025\$@db.znrjfbovxodgwwtlbx.supabase.co:5432/postgres?sslmode=require"

cd eaas-backend

echo "🔄 Running migration..."
echo "📝 Using DATABASE_URL: ${DATABASE_URL:0:50}..."
npm run migrate

echo ""
echo "🔄 Running seed..."
npm run seed

echo ""
echo "✅ Done! Check Supabase dashboard to verify tables were created."

