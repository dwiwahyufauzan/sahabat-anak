import { unlink, writeFile, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

/**
 * Secure file upload configuration
 */
export const UPLOAD_CONFIG = {
  // Maximum file sizes per category (in bytes)
  MAX_FILE_SIZE: {
    image: 5 * 1024 * 1024,      // 5MB for images
    document: 10 * 1024 * 1024,  // 10MB for documents
    default: 5 * 1024 * 1024,     // 5MB default
  },

  // Allowed MIME types (whitelist)
  ALLOWED_MIME_TYPES: {
    image: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },

  // Allowed file extensions (whitelist)
  ALLOWED_EXTENSIONS: {
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    document: ['.pdf', '.doc', '.docx'],
  },

  // Upload directories
  UPLOAD_DIRS: {
    'payment-proofs': 'payment-proofs',
    'programs': 'programs',
    'news': 'news',
    'team': 'team',
    'general': 'general',
  },
};

/**
 * Sanitize filename to prevent path traversal and injection attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  let sanitized = basename(filename);
  
  // Remove any non-alphanumeric characters except dots, dashes, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '-');
  
  // Remove multiple consecutive dots (prevent directory traversal)
  sanitized = sanitized.replace(/\.{2,}/g, '.');
  
  // Remove leading/trailing dots and dashes
  sanitized = sanitized.replace(/^[.-]+|[.-]+$/g, '');
  
  // Limit filename length
  const maxLength = 100;
  if (sanitized.length > maxLength) {
    const ext = extname(sanitized);
    const nameWithoutExt = sanitized.substring(0, maxLength - ext.length);
    sanitized = nameWithoutExt + ext;
  }
  
  return sanitized || 'file';
}

/**
 * Generate secure random filename
 */
export function generateSecureFilename(originalName: string, prefix: string = ''): string {
  const ext = extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  
  return prefix ? `${prefix}-${timestamp}-${randomBytes}${ext}` : `${timestamp}-${randomBytes}${ext}`;
}

/**
 * Validate file extension against whitelist
 */
export function validateFileExtension(filename: string, category: 'image' | 'document'): boolean {
  const ext = extname(filename).toLowerCase();
  const allowedExtensions = UPLOAD_CONFIG.ALLOWED_EXTENSIONS[category];
  
  return allowedExtensions.includes(ext);
}

/**
 * Validate MIME type against whitelist
 */
export function validateMimeType(mimeType: string, category: 'image' | 'document'): boolean {
  const allowedTypes = UPLOAD_CONFIG.ALLOWED_MIME_TYPES[category];
  
  // Normalize MIME type (lowercase, remove parameters)
  const normalizedType = mimeType.toLowerCase().split(';')[0].trim();
  
  return allowedTypes.includes(normalizedType);
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, category: 'image' | 'document' = 'image'): boolean {
  const maxSize = UPLOAD_CONFIG.MAX_FILE_SIZE[category] || UPLOAD_CONFIG.MAX_FILE_SIZE.default;
  return size <= maxSize;
}

/**
 * Check for potential file content threats (basic magic byte validation)
 */
export function validateFileContent(buffer: Buffer, expectedMimeType: string): boolean {
  // Magic bytes for common file types
  const magicBytes: { [key: string]: number[][] } = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47]],
    'image/gif': [[0x47, 0x49, 0x46, 0x38]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  };

  const expectedBytes = magicBytes[expectedMimeType.toLowerCase()];
  
  if (!expectedBytes) {
    // If we don't have magic bytes defined, allow it (but log warning)
    console.warn(`No magic byte validation for MIME type: ${expectedMimeType}`);
    return true;
  }

  // Check if buffer starts with any of the expected magic bytes
  return expectedBytes.some(bytes => {
    return bytes.every((byte, index) => buffer[index] === byte);
  });
}

/**
 * Comprehensive file upload validation
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

export function validateUpload(
  file: File,
  category: 'image' | 'document' = 'image'
): FileValidationResult {
  // 1. Check if file exists
  if (!file || !file.name) {
    return { valid: false, error: 'No file provided' };
  }

  // 2. Sanitize filename
  const sanitizedFilename = sanitizeFilename(file.name);
  
  // 3. Validate file extension
  if (!validateFileExtension(sanitizedFilename, category)) {
    const allowed = UPLOAD_CONFIG.ALLOWED_EXTENSIONS[category].join(', ');
    return { 
      valid: false, 
      error: `Invalid file extension. Allowed: ${allowed}` 
    };
  }

  // 4. Validate MIME type
  if (!validateMimeType(file.type, category)) {
    const allowed = UPLOAD_CONFIG.ALLOWED_MIME_TYPES[category].join(', ');
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${allowed}` 
    };
  }

  // 5. Validate file size
  if (!validateFileSize(file.size, category)) {
    const maxSizeMB = UPLOAD_CONFIG.MAX_FILE_SIZE[category] / (1024 * 1024);
    return { 
      valid: false, 
      error: `File size exceeds ${maxSizeMB}MB limit` 
    };
  }

  // 6. Check for empty files
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true, sanitizedFilename };
}

/**
 * Secure file upload with comprehensive validation
 */
export async function secureFileUpload(
  file: File,
  folder: keyof typeof UPLOAD_CONFIG.UPLOAD_DIRS,
  category: 'image' | 'document' = 'image',
  prefix?: string
): Promise<string> {
  // 1. Validate file
  const validation = validateUpload(file, category);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Read file buffer for content validation
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Validate file content (magic bytes)
  if (!validateFileContent(buffer, file.type)) {
    throw new Error('File content does not match declared type. Possible file type mismatch or malicious file.');
  }

  // 4. Create upload directory if it doesn't exist
  const uploadFolder = UPLOAD_CONFIG.UPLOAD_DIRS[folder] || folder;
  const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', uploadFolder);
  
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // 5. Generate secure filename
  const secureFilename = generateSecureFilename(validation.sanitizedFilename!, prefix || uploadFolder);
  const filepath = join(UPLOAD_DIR, secureFilename);

  // 6. Check if file already exists (prevent overwrites)
  if (existsSync(filepath)) {
    throw new Error('File already exists. Please try again.');
  }

  // 7. Write file with restricted permissions
  await writeFile(filepath, buffer, { mode: 0o644 });

  // 8. Return relative path
  return `/uploads/${uploadFolder}/${secureFilename}`;
}

/**
 * Secure file deletion with path validation
 */
export async function secureFileDelete(filepath: string): Promise<void> {
  try {
    // Validate that path is within uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const fullPath = join(process.cwd(), 'public', filepath);
    
    // Prevent directory traversal
    if (!fullPath.startsWith(uploadsDir)) {
      throw new Error('Invalid file path: Path traversal detected');
    }

    // Check if file exists before attempting delete
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error: any) {
    // Log error but don't throw for non-existent files
    if (error.code !== 'ENOENT') {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }
}

/**
 * Get upload statistics (for monitoring)
 */
export function getUploadStats() {
  return {
    maxFileSizes: UPLOAD_CONFIG.MAX_FILE_SIZE,
    allowedTypes: UPLOAD_CONFIG.ALLOWED_MIME_TYPES,
    allowedExtensions: UPLOAD_CONFIG.ALLOWED_EXTENSIONS,
    uploadDirs: UPLOAD_CONFIG.UPLOAD_DIRS,
  };
}
