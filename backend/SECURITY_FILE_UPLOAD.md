# File Upload Security Implementation

## Overview

Comprehensive file upload security has been implemented to protect against malicious file uploads, path traversal attacks, and other common vulnerabilities. The system uses multiple layers of validation to ensure only safe files are stored.

## Security Features Implemented

### 1. **File Type Validation (Whitelist)**
- ✅ MIME type validation against strict whitelist
- ✅ File extension validation
- ✅ Magic byte verification (file signature checking)
- ✅ Content-type mismatch detection

**Allowed File Types:**
```typescript
// Images
- JPEG/JPG (image/jpeg, image/jpg)
- PNG (image/png)
- WebP (image/webp)
- GIF (image/gif)

// Documents (if needed in future)
- PDF (application/pdf)
- Word (application/msword, .docx)
```

### 2. **File Size Limits**
- **Images**: 5MB maximum
- **Documents**: 10MB maximum (for future use)
- Empty file detection and rejection

### 3. **Filename Sanitization**
- Removes path components (prevents directory traversal)
- Strips special characters (keeps only alphanumeric, dots, dashes, underscores)
- Prevents multiple consecutive dots (`..` attacks)
- Removes leading/trailing dangerous characters
- Limits filename length to 100 characters

### 4. **Magic Byte Verification**
Validates actual file content matches declared MIME type:

```typescript
// Example magic bytes checked
JPEG: 0xFF 0xD8 0xFF
PNG:  0x89 0x50 0x4E 0x47
GIF:  0x47 0x49 0x46
PDF:  0x25 0x50 0x44 0x46 (%PDF)
```

### 5. **Secure Filename Generation**
- Uses cryptographic random bytes (crypto.randomBytes)
- Timestamp-based uniqueness
- Prevents filename collisions
- Format: `{prefix}-{timestamp}-{random32hex}.{ext}`

### 6. **Path Traversal Prevention**
- Validates upload path is within allowed directory
- Blocks `../` and similar patterns
- Uses absolute paths with validation
- Secure deletion prevents unauthorized file access

### 7. **File Permission Control**
- Files written with restricted permissions (0o644)
- Owner: read/write
- Group: read only
- Others: read only

## Implementation Files

### Core Security Utility
**File**: `backend/src/utils/secureUpload.ts`

**Main Functions:**
```typescript
// Validate and upload file securely
secureFileUpload(file, folder, category, prefix?): Promise<string>

// Validate file without uploading
validateUpload(file, category): FileValidationResult

// Sanitize filename
sanitizeFilename(filename): string

// Generate secure random filename
generateSecureFilename(originalName, prefix?): string

// Validate MIME type
validateMimeType(mimeType, category): boolean

// Validate file extension
validateFileExtension(filename, category): boolean

// Validate file size
validateFileSize(size, category): boolean

// Check file content (magic bytes)
validateFileContent(buffer, expectedMimeType): boolean

// Secure file deletion
secureFileDelete(filepath): Promise<void>

// Get upload statistics
getUploadStats(): object
```

### Updated Routes

#### 1. **Admin Upload Route** (`backend/src/routes/admin/upload.ts`)
```typescript
POST /api/admin/upload
- Protected by authentication
- Used for team member photos, news images, program images
- Validates: file type, size, content
- Returns: { success, filename, url, message }

DELETE /api/admin/upload/image
- Protected by authentication
- Secure path validation
- Prevents unauthorized deletion
```

#### 2. **Public Donation Route** (`backend/src/routes/public.ts`)
```typescript
POST /api/donations
- Accepts payment proof images
- Folder: payment-proofs/
- Validates: MIME type, size, magic bytes
- Sanitizes filename
- Prevents malicious uploads
```

## Upload Configuration

**Default Limits:**
```typescript
UPLOAD_CONFIG = {
  MAX_FILE_SIZE: {
    image: 5 * 1024 * 1024,      // 5MB
    document: 10 * 1024 * 1024,  // 10MB
    default: 5 * 1024 * 1024,
  },
  
  UPLOAD_DIRS: {
    'payment-proofs': 'payment-proofs',
    'programs': 'programs',
    'news': 'news',
    'team': 'team',
    'general': 'general',
  }
}
```

## Security Flow

```
User uploads file
    ↓
1. Check file exists
    ↓
2. Sanitize filename
    ↓
3. Validate file extension (whitelist)
    ↓
4. Validate MIME type (whitelist)
    ↓
5. Validate file size
    ↓
6. Check for empty file
    ↓
7. Read file buffer
    ↓
8. Validate magic bytes (content)
    ↓
9. Verify path is within allowed directory
    ↓
10. Generate secure random filename
    ↓
11. Check file doesn't already exist
    ↓
12. Write file with restricted permissions
    ↓
13. Return relative path
```

## Usage Examples

### Secure File Upload
```typescript
// In route handler
import { secureFileUpload } from '../utils/secureUpload';

const imagePath = await secureFileUpload(
  file,                    // File from request
  'team',                  // Upload folder
  'image',                 // Category (image/document)
  'team-photo'            // Optional prefix
);
// Returns: /uploads/team/team-photo-1234567890-abc123def456.jpg
```

### Validate Before Upload
```typescript
import { validateUpload } from '../utils/secureUpload';

const validation = validateUpload(file, 'image');
if (!validation.valid) {
  throw new Error(validation.error);
}
// Proceed with upload...
```

### Secure File Deletion
```typescript
import { secureFileDelete } from '../utils/secureUpload';

await secureFileDelete('/uploads/team/old-photo.jpg');
// Validates path is within uploads directory
// Prevents directory traversal attacks
```

## Error Messages

The system provides clear, user-friendly error messages:

- `"No file provided"` - File is missing
- `"Invalid file extension. Allowed: .jpg, .jpeg, .png, .webp, .gif"` - Wrong file type
- `"Invalid file type. Allowed: image/jpeg, image/png, ..."` - MIME type mismatch
- `"File size exceeds 5MB limit"` - File too large
- `"File is empty"` - Zero-byte file
- `"File content does not match declared type. Possible file type mismatch or malicious file."` - Magic byte mismatch
- `"Invalid file path: Path traversal detected"` - Security violation

## Testing Validation

### Test Valid Image Upload
```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@test-image.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "filename": "team-1234567890-abc123def456.jpg",
  "url": "/uploads/team/team-1234567890-abc123def456.jpg",
  "message": "Image uploaded successfully"
}
```

### Test Invalid File Type
```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@malicious.exe"
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid file extension. Allowed: .jpg, .jpeg, .png, .webp, .gif"
}
```

### Test Oversized File
Upload a file larger than 5MB

**Expected Response:**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

### Test MIME Type Spoofing
Rename `malicious.exe` to `fake.jpg` and upload

**Expected Response:**
```json
{
  "success": false,
  "error": "File content does not match declared type. Possible file type mismatch or malicious file."
}
```

## Attack Prevention

### 1. **Path Traversal Prevention**
```
❌ Blocked: ../../etc/passwd
❌ Blocked: ..%2F..%2Fetc%2Fpasswd
❌ Blocked: /var/www/uploads/../../../secret.txt
✅ Allowed: /uploads/team/photo.jpg
```

### 2. **MIME Type Spoofing Prevention**
```
❌ Blocked: malicious.exe renamed to image.jpg
❌ Blocked: PHP shell disguised as PNG
❌ Blocked: Files with mismatched MIME types
✅ Allowed: Genuine JPEG/PNG/WebP/GIF files
```

### 3. **Filename Injection Prevention**
```
❌ Sanitized: ../../../../etc/passwd → etc-passwd
❌ Sanitized: <script>alert(1)</script>.jpg → script-alert-1---script-.jpg
❌ Sanitized: file;rm -rf /.jpg → file-rm--rf--.jpg
✅ Clean: my-photo-2024.jpg → my-photo-2024.jpg
```

### 4. **File Bomb Prevention**
```
❌ Rejected: 50MB image file (exceeds 5MB limit)
❌ Rejected: 0 byte file (empty file)
✅ Allowed: 2MB legitimate image
```

## Security Best Practices

### ✅ DO
- Always use `secureFileUpload()` for new upload endpoints
- Validate file type on both client and server
- Keep UPLOAD_CONFIG whitelists strict and minimal
- Log suspicious upload attempts
- Regularly review uploaded files
- Set proper file permissions (0o644)
- Use HTTPS in production to encrypt file uploads
- Implement rate limiting on upload endpoints

### ❌ DON'T
- Don't trust client-provided filenames
- Don't rely only on file extension validation
- Don't store executable files (.exe, .sh, .php, etc.)
- Don't allow unlimited file sizes
- Don't skip MIME type validation
- Don't use user-provided paths directly
- Don't allow uploads without authentication (except public forms)

## Future Enhancements

### 1. **Virus Scanning**
Consider integrating with antivirus services:
```bash
npm install clamav.js
# or use cloud-based scanning services
```

### 2. **Image Processing**
Add automatic image optimization:
```typescript
// Example with Sharp
import sharp from 'sharp';

await sharp(buffer)
  .resize(1920, 1080, { fit: 'inside' })
  .jpeg({ quality: 85 })
  .toFile(filepath);
```

### 3. **CDN Integration**
For production, consider cloud storage:
- AWS S3 with CloudFront
- Google Cloud Storage
- Cloudinary
- ImageKit

### 4. **Upload Rate Limiting**
```typescript
// Add to middleware
const uploadRateLimiter = createRateLimiter({
  max: 10,              // 10 uploads
  duration: 60 * 1000,  // per minute
});
```

### 5. **File Quarantine**
Implement quarantine folder for suspicious files:
```typescript
if (suspiciousScore > threshold) {
  moveToQuarantine(file);
  alertAdministrator();
}
```

## Monitoring & Logging

### What to Log
```typescript
// Log successful uploads
console.log({
  event: 'FILE_UPLOAD_SUCCESS',
  user: userId,
  filename: sanitizedFilename,
  size: file.size,
  mimeType: file.type,
  folder: uploadFolder,
  timestamp: new Date().toISOString(),
});

// Log security violations
console.warn({
  event: 'FILE_UPLOAD_BLOCKED',
  reason: validation.error,
  filename: file.name,
  size: file.size,
  mimeType: file.type,
  ip: request.ip,
  timestamp: new Date().toISOString(),
});
```

### Metrics to Track
- Total uploads per day
- Failed upload attempts
- Blocked malicious files
- Average file size
- Popular upload folders
- Security violations by type

## Production Checklist

Before deploying to production:

- [ ] All upload endpoints use `secureFileUpload()`
- [ ] MIME type whitelist is properly configured
- [ ] File size limits are appropriate
- [ ] Magic byte validation is working
- [ ] Path traversal prevention is tested
- [ ] Filename sanitization is active
- [ ] File permissions are restrictive (0o644)
- [ ] HTTPS is enforced for uploads
- [ ] Rate limiting is enabled on upload endpoints
- [ ] Error messages don't leak system information
- [ ] Logging and monitoring are configured
- [ ] Regular security audits are scheduled
- [ ] Backup strategy for uploaded files
- [ ] CDN/cloud storage is configured (optional)

## Support & Maintenance

### Regular Tasks
1. **Weekly**: Review upload logs for suspicious patterns
2. **Monthly**: Audit uploaded files, remove unused/old files
3. **Quarterly**: Update security dependencies, review MIME type whitelist
4. **Annually**: Full security audit, penetration testing

### Common Issues

**Issue**: "File content does not match declared type"
**Solution**: User renamed file extension. Ask them to upload original file.

**Issue**: "File size exceeds limit"
**Solution**: Ask user to compress or resize image before uploading.

**Issue**: Path traversal detected
**Solution**: Security violation. Review logs, check for attack patterns.

## References

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Magic Bytes List](https://en.wikipedia.org/wiki/List_of_file_signatures)
- [MIME Types Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

---

**Last Updated**: January 2025  
**Security Level**: Priority 1 - Production Ready  
**Status**: ✅ Implemented and Tested
