# Environment Setup Guide

## Backend Environment Configuration

### Required Environment Variables

The backend uses **Zod** for strict environment variable validation. All required variables **must** be set before starting the server.

### Setup Steps

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and set all required values:**

   ```bash
   # Use your preferred editor
   nano .env
   # or
   code .env
   ```

3. **Required Variables:**

   | Variable | Required | Description | Example |
   |----------|----------|-------------|---------|
   | `DB_HOST` | ✅ | Database host | `localhost` |
   | `DB_PORT` | ✅ | Database port | `3306` |
   | `DB_USER` | ✅ | Database username | `root` |
   | `DB_PASSWORD` | ⚠️ | Database password | `your_password` |
   | `DB_NAME` | ✅ | Database name | `sahabat_anak` |
   | `PORT` | ❌ | Server port (default: 3000) | `3000` |
   | `NODE_ENV` | ❌ | Environment (default: development) | `development` |
   | `FRONTEND_URL` | ✅ | Frontend URL for CORS | `http://localhost:5173` |
   | `JWT_SECRET` | ✅ | **Min 32 chars!** | Generate with command below |
   | `SMTP_HOST` | ✅ | Email server host | `smtp.gmail.com` |
   | `SMTP_PORT` | ✅ | Email server port | `587` |
   | `SMTP_SECURE` | ❌ | Use TLS (default: false) | `false` |
   | `SMTP_USER` | ✅ | Email address | `your@email.com` |
   | `SMTP_PASS` | ✅ | Email password/app password | `your_app_password` |

### Generate Secure JWT Secret

```bash
# On Linux/Mac:
openssl rand -base64 64

# On Windows (PowerShell):
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator (for development only):
# https://generate-secret.vercel.app/64
```

### Production Security Checklist

- [ ] `JWT_SECRET` is at least 32 characters and randomly generated
- [ ] `JWT_SECRET` does NOT contain words like "super-secret" or "change"
- [ ] `FRONTEND_URL` uses HTTPS (not HTTP)
- [ ] Database credentials are secure
- [ ] SMTP credentials are valid and secure
- [ ] `.env` file is in `.gitignore` (never commit it!)

### Validation Errors

If environment validation fails, you'll see detailed error messages:

```
❌ Environment variable validation failed:
  - JWT_SECRET: JWT_SECRET must be at least 32 characters long for security
  - FRONTEND_URL: FRONTEND_URL must be a valid URL
  - SMTP_USER: SMTP_USER must be a valid email

💡 Please check your .env file and ensure all required variables are set.
📖 See .env.example for reference.
```

### Testing Your Configuration

```bash
cd backend
bun run dev
```

If successful, you should see:
```
🚀 Server is running on http://localhost:3000
📚 Swagger documentation: http://localhost:3000/swagger
🌍 Environment: development
🔗 CORS enabled for: http://localhost:5173
```

---

## Frontend Environment Configuration

### Setup Steps

1. **Copy the example file:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit `.env`:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **For Production:**
   ```env
   VITE_API_URL=https://api.sahabat-anak.org/api
   ```

### Important Notes

- Variables must be prefixed with `VITE_` to be accessible in the app
- Changes to `.env` require restarting the dev server
- In production, set these via your hosting platform's environment variables

### Testing Your Configuration

```bash
cd frontend
bun run dev
```

The app should connect to your backend API successfully.

---

## Common Issues

### Issue: "JWT_SECRET is required"
**Solution:** Add `JWT_SECRET` to your `.env` file with at least 32 characters.

### Issue: "FRONTEND_URL must be a valid URL"
**Solution:** Ensure the URL is complete including protocol (http:// or https://)

### Issue: "Database connection failed"
**Solution:** 
1. Check if MySQL is running
2. Verify database credentials in `.env`
3. Ensure database exists: `CREATE DATABASE sahabat_anak;`

### Issue: Frontend can't connect to backend
**Solution:**
1. Check if backend is running
2. Verify `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors
4. Ensure `FRONTEND_URL` in backend matches your frontend URL

---

## Quick Start (Development)

```bash
# 1. Setup backend
cd backend
cp .env.example .env
# Edit .env with your values
bun install
bun run dev

# 2. Setup frontend (in new terminal)
cd frontend
cp .env.example .env
# Edit .env if needed
bun install
bun run dev
```

---

## Environment Variables in Production

### Railway
Set environment variables in: Project → Variables

### Render
Set environment variables in: Service → Environment

### Vercel (Frontend)
Set environment variables in: Project Settings → Environment Variables

### GitHub Actions
Set secrets in: Repository Settings → Secrets and variables → Actions

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** (especially after team changes)
4. **Use environment-specific values** (don't use production DB in development)
5. **Limit access** to production environment variables
6. **Use strong passwords** for database and email accounts
7. **Enable 2FA** on email accounts used for SMTP

---

## Need Help?

- Check `.env.example` for reference
- See [DEPLOYMENT.md](../DEPLOYMENT.md) for production deployment
- Backend validation errors show exactly what's missing
- All required variables are documented in this guide
