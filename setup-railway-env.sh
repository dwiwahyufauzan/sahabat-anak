#!/bin/bash

echo "🚀 Railway Environment Setup Helper"
echo "===================================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔑 Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ Generated: $JWT_SECRET"
echo ""

echo "📝 Setting Environment Variables..."
echo "Please enter the following information:"
echo ""

# Database
read -p "🗄️  DB_HOST (from Railway PostgreSQL): " DB_HOST
read -p "🗄️  DB_PORT [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "🗄️  DB_USER (from Railway PostgreSQL): " DB_USER
read -sp "🗄️  DB_PASSWORD (from Railway PostgreSQL): " DB_PASSWORD
echo ""
read -p "🗄️  DB_NAME (from Railway PostgreSQL): " DB_NAME

echo ""

# Frontend URL
read -p "🌐 FRONTEND_URL (e.g., https://your-site.vercel.app): " FRONTEND_URL

echo ""

# SMTP
read -p "📧 SMTP_HOST [smtp.gmail.com]: " SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
read -p "📧 SMTP_PORT [587]: " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}
read -p "📧 SMTP_USER (your email): " SMTP_USER
read -sp "📧 SMTP_PASS (App Password): " SMTP_PASS
echo ""

echo ""
echo "🚀 Setting variables in Railway..."
echo ""

railway variables set DB_HOST="$DB_HOST"
railway variables set DB_PORT="$DB_PORT"
railway variables set DB_USER="$DB_USER"
railway variables set DB_PASSWORD="$DB_PASSWORD"
railway variables set DB_NAME="$DB_NAME"
railway variables set FRONTEND_URL="$FRONTEND_URL"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set SMTP_HOST="$SMTP_HOST"
railway variables set SMTP_PORT="$SMTP_PORT"
railway variables set SMTP_SECURE="false"
railway variables set SMTP_USER="$SMTP_USER"
railway variables set SMTP_PASS="$SMTP_PASS"

echo ""
echo "✅ All environment variables set!"
echo ""
echo "🔄 Triggering redeploy..."
railway up

echo ""
echo "📊 Checking logs..."
railway logs

echo ""
echo "✨ Done! Your backend should be deploying now."
echo "📱 Check Railway dashboard: https://railway.app/dashboard"
