# Sahabat Anak Indonesia

Website yayasan nirlaba yang berfokus pada kesejahteraan dan pendidikan anak-anak marjinal di Indonesia.

## 🔒 Security Status

**Priority 1 Security**: ✅ **COMPLETE** (9.0/10)

- ✅ Environment Variable Management (Zod validation)
- ✅ Rate Limiting (Brute force protection)
- ✅ File Upload Security (Multi-layer validation)
- ✅ No Hardcoded Secrets
- ✅ Production-Safe Configuration

See [SECURITY_PRIORITY1_COMPLETE.md](./SECURITY_PRIORITY1_COMPLETE.md) for details.

## Tech Stack

### Frontend
- **Framework**: SvelteKit 2.49.1 (Svelte 5)
- **Styling**: Tailwind CSS 4.1.17
- **Deployment**: GitHub Pages (Auto-deploy)

### Backend
- **Runtime**: Bun 1.3.4
- **Framework**: Elysia 1.1.0
- **Database**: MySQL with Drizzle ORM
- **Auth**: JWT (@elysiajs/jwt)
- **Validation**: Zod 4.2.1
- **Security**: Custom rate limiting, secure file uploads

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend
```bash
cd backend
bun install
bun run dev
# Runs on http://localhost:3000
# Swagger docs: http://localhost:3000/swagger
```

## Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
bun run build
```

## Deploy

### Frontend
Project ini otomatis di-deploy ke GitHub Pages saat push ke branch `main`.

### Backend
Deploy ke Railway atau Render:
```bash
# Pastikan environment variables sudah di-set
# Lihat backend/.env.example untuk daftar variabel yang dibutuhkan
```

## 📚 Documentation

- [Environment Setup](./backend/ENV_SETUP.md)
- [Security Improvements](./backend/SECURITY_IMPROVEMENTS_ENV.md)
- [Rate Limiting](./backend/SECURITY_RATE_LIMITING.md)
- [File Upload Security](./backend/SECURITY_FILE_UPLOAD.md)
- [Priority 1 Complete](./SECURITY_PRIORITY1_COMPLETE.md)
- [Admin UI Updates](./ADMIN_UI_UPDATE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🔐 Security Features

### Environment Validation
- Runtime validation dengan Zod
- Production-safe defaults
- Auto-exit on invalid configuration

### Rate Limiting
- Global: 100 requests/minute
- Login: 5 attempts/15 minutes
- Register: 3 attempts/hour

### File Upload Security
- MIME type whitelist
- Magic byte verification
- Filename sanitization
- Path traversal prevention
- Size limits (5MB images)

## Testing

### Backend Tests
```bash
cd backend
bun test                    # Run all tests
bun test secureUpload      # Run file upload security tests
```

### Test Coverage
- ✅ 38 file upload security tests (100% passing)
- ✅ Environment validation tests
- ✅ Rate limiting tests

## Project Structure

```
sahabat-anak/
├── backend/                    # Bun + Elysia API
│   ├── src/
│   │   ├── config/            # Environment validation
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, rate limiting
│   │   ├── routes/           # API endpoints
│   │   ├── utils/            # Secure upload, helpers
│   │   └── tests/            # Security tests
│   ├── public/uploads/       # File storage
│   └── *.md                  # Documentation
├── frontend/                  # SvelteKit app
│   ├── src/
│   │   ├── routes/           # Pages
│   │   ├── lib/              # Components, utils
│   │   └── app.html          # HTML template
│   └── static/               # Static assets
└── *.md                      # Project docs
```
