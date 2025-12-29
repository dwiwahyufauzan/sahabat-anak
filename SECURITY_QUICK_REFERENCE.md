# Security Quick Reference Guide

Quick reference for developers working on the Sahabat Anak project.

## 🚨 Critical Rules

### ❌ NEVER DO
```typescript
// ❌ NEVER hardcode secrets
const JWT_SECRET = "my-secret-key";

// ❌ NEVER use unsafe fallbacks
const secret = process.env.JWT_SECRET || "default-secret";

// ❌ NEVER trust user filenames directly
const filepath = `/uploads/${file.name}`;

// ❌ NEVER skip file validation
await writeFile(filepath, buffer);

// ❌ NEVER disable rate limiting in production
if (process.env.NODE_ENV !== 'production') {
  app.use(rateLimit);
}
```

### ✅ ALWAYS DO
```typescript
// ✅ ALWAYS use environment validation
import { config } from './config/env';
const secret = config.JWT_SECRET;

// ✅ ALWAYS use secure file upload
import { secureFileUpload } from './utils/secureUpload';
const path = await secureFileUpload(file, 'folder', 'image');

// ✅ ALWAYS apply rate limiting
import { createRateLimiter } from './middleware/rateLimit';
app.use(createRateLimiter({ max: 100, duration: 60000 }));

// ✅ ALWAYS validate user input
import { z } from 'zod';
const schema = z.object({ email: z.string().email() });
const data = schema.parse(body);
```

---

## 📁 File Upload Checklist

Before adding a new file upload endpoint:

```typescript
// 1. Import secure upload utility
import { secureFileUpload } from '../utils/secureUpload';

// 2. Define route with file type validation
app.post('/upload', async ({ body, set }) => {
  // 3. Validate file exists
  if (!body.file) {
    set.status = 400;
    return { error: 'No file provided' };
  }

  // 4. Use secure upload with proper parameters
  try {
    const path = await secureFileUpload(
      body.file,           // File object
      'folder-name',       // Must be in UPLOAD_CONFIG.UPLOAD_DIRS
      'image',            // Category: 'image' or 'document'
      'optional-prefix'   // Optional: prefix for filename
    );
    
    return { success: true, path };
  } catch (error) {
    set.status = 400;
    return { error: error.message };
  }
}, {
  // 5. Add Elysia validation
  body: t.Object({
    file: t.File({
      type: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024 // 5MB
    })
  })
});
```

**Validation Performed Automatically**:
- ✅ File type (MIME + extension)
- ✅ File size
- ✅ Magic bytes
- ✅ Filename sanitization
- ✅ Path traversal prevention
- ✅ Empty file detection

---

## 🔒 Rate Limiting Quick Guide

### Global Rate Limiting
Already applied in `index.ts`:
```typescript
// 100 requests per minute per IP
app.use(createRateLimiter({ max: 100, duration: 60 * 1000 }));
```

### Endpoint-Specific Rate Limiting
```typescript
import { createRateLimiter } from './middleware/rateLimit';

// Create specific limiter
const strictLimiter = createRateLimiter({
  max: 5,                    // 5 requests
  duration: 15 * 60 * 1000  // per 15 minutes
});

// Apply to route
app.post('/sensitive-action', 
  strictLimiter,  // Add as middleware
  async ({ body }) => {
    // Handler code
  }
);
```

**Common Limits**:
- Login: 5 per 15 minutes
- Register: 3 per hour
- Password reset: 3 per hour
- Contact form: 10 per hour
- General API: 100 per minute

---

## 🌍 Environment Variables

### Required Variables

**Backend** (`.env`):
```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-secure-password
DB_NAME=sahabat_anak

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@sahabatanak.org

# Environment
NODE_ENV=development
```

**Frontend** (`.env`):
```bash
# API URL (production only)
VITE_API_URL=https://api.sahabatanak.org/api
```

### Validation
Environment variables are validated at startup. Server will **EXIT** if invalid.

---

## 🧪 Testing Security Features

### Run All Tests
```bash
cd backend
bun test
```

### Test Specific Feature
```bash
bun test secureUpload    # File upload security
bun test auth           # Authentication
bun test donations      # Donations
```

### Manual Testing

**Test Rate Limiting**:
```bash
# Send 6 login requests quickly (should get 429 on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**Test File Upload Security**:
```bash
# Valid upload
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg"

# Invalid file type (should reject)
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@malware.exe"
```

---

## 🐛 Common Issues & Solutions

### Issue: Server won't start

**Error**: `Environment validation failed`

**Solution**: Check `.env` file
```bash
# Copy example and fill in values
cp .env.example .env
nano .env  # Edit with proper values
```

### Issue: File upload rejected

**Error**: `Invalid file extension`

**Solution**: Check allowed file types in `UPLOAD_CONFIG`:
```typescript
// backend/src/utils/secureUpload.ts
ALLOWED_EXTENSIONS: {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  document: ['.pdf', '.doc', '.docx'],
}
```

### Issue: Rate limit too strict

**Error**: `Too many requests`

**Solution**: Adjust rate limits in route:
```typescript
// backend/src/routes/auth.ts
const loginRateLimiter = createRateLimiter({
  max: 10,                   // Increase from 5
  duration: 15 * 60 * 1000  // Keep same
});
```

### Issue: CORS error

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: Check CORS configuration in `index.ts`:
```typescript
app.use(cors({
  origin: config.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

---

## 📝 Code Review Checklist

Before merging code, verify:

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables validated
- [ ] File uploads use `secureFileUpload()`
- [ ] Rate limiting applied to new endpoints
- [ ] User input validated with Zod
- [ ] Error messages don't leak sensitive info

### Code Quality
- [ ] Tests written for new features
- [ ] Documentation updated
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Console.logs removed (use proper logging)

### Performance
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] File operations are async
- [ ] Large responses paginated

---

## 🔍 Security Monitoring

### Log Patterns to Watch

**Suspicious Activity**:
```typescript
// Multiple failed login attempts
[WARN] Rate limit exceeded: IP=1.2.3.4, endpoint=/api/auth/login

// Invalid file upload attempts
[WARN] File upload blocked: reason=Invalid file extension, file=shell.php

// Environment validation failures (should only happen in dev)
[ERROR] Environment validation failed: JWT_SECRET is required
```

### Metrics to Track
- Failed authentication attempts per IP
- Rate limit violations per endpoint
- File upload rejections by reason
- Average response time
- Error rate by endpoint

---

## 🚀 Deployment Checklist

Before deploying to production:

### Environment
- [ ] All environment variables set in hosting platform
- [ ] `NODE_ENV=production`
- [ ] Strong JWT_SECRET (min 32 chars, random)
- [ ] Database credentials secure
- [ ] SMTP configured (if using email features)

### Security
- [ ] HTTPS enabled
- [ ] CORS limited to production domain
- [ ] Rate limiting active
- [ ] File upload security enabled
- [ ] Error messages sanitized (no stack traces)

### Testing
- [ ] All tests passing
- [ ] Manual testing of critical flows
- [ ] File uploads tested
- [ ] Rate limiting tested
- [ ] Authentication tested

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring active
- [ ] Security alerts configured

---

## 📞 Support

### Documentation
1. [ENV_SETUP.md](./backend/ENV_SETUP.md) - Environment setup
2. [SECURITY_RATE_LIMITING.md](./backend/SECURITY_RATE_LIMITING.md) - Rate limiting
3. [SECURITY_FILE_UPLOAD.md](./backend/SECURITY_FILE_UPLOAD.md) - File uploads
4. [SECURITY_PRIORITY1_COMPLETE.md](./SECURITY_PRIORITY1_COMPLETE.md) - Security overview

### Quick Commands

```bash
# Start development
cd backend && bun run dev
cd frontend && npm run dev

# Run tests
cd backend && bun test

# Check for errors
cd backend && bun run build

# View logs
tail -f backend/logs/error.log

# Database migration
cd backend && bun run migrate
```

---

**Last Updated**: January 2025  
**Security Level**: Production-Ready  
**Version**: Priority 1 Complete
