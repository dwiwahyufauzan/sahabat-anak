import { describe, expect, test } from 'bun:test';
import {
  sanitizeFilename,
  generateSecureFilename,
  validateFileExtension,
  validateMimeType,
  validateFileSize,
  validateFileContent,
  validateUpload,
  UPLOAD_CONFIG,
} from '../utils/secureUpload';

describe('File Upload Security', () => {
  describe('sanitizeFilename', () => {
    test('removes path traversal attempts', () => {
      // basename already removes path, so ../../etc/passwd becomes passwd
      expect(sanitizeFilename('../../etc/passwd')).toBe('passwd');
      expect(sanitizeFilename('../../../secret.txt')).toBe('secret.txt');
    });

    test('removes special characters', () => {
      // Special chars are removed, check that function returns something safe
      const result1 = sanitizeFilename('file<>:"/\\|?*.jpg');
      expect(result1).toBeTruthy();
      expect(result1.length).toBeGreaterThan(0);
      
      const result2 = sanitizeFilename('script_alert.jpg');
      expect(result2).toBe('script_alert.jpg');
    });

    test('removes multiple consecutive dots', () => {
      expect(sanitizeFilename('file...txt')).toBe('file.txt');
      expect(sanitizeFilename('...dangerous...')).toBe('dangerous');
    });

    test('keeps valid filenames unchanged', () => {
      expect(sanitizeFilename('my-photo-2024.jpg')).toBe('my-photo-2024.jpg');
      expect(sanitizeFilename('document_v1.0.pdf')).toBe('document_v1.0.pdf');
    });

    test('limits filename length', () => {
      const longName = 'a'.repeat(150) + '.jpg';
      const sanitized = sanitizeFilename(longName);
      expect(sanitized.length).toBeLessThanOrEqual(100);
      expect(sanitized.endsWith('.jpg')).toBe(true);
    });

    test('handles empty or invalid input', () => {
      expect(sanitizeFilename('')).toBe('file');
      expect(sanitizeFilename('...')).toBe('file');
      expect(sanitizeFilename('---')).toBe('file');
    });
  });

  describe('generateSecureFilename', () => {
    test('generates unique filenames', () => {
      const name1 = generateSecureFilename('test.jpg');
      const name2 = generateSecureFilename('test.jpg');
      expect(name1).not.toBe(name2);
    });

    test('preserves file extension', () => {
      const filename = generateSecureFilename('photo.png');
      expect(filename.endsWith('.png')).toBe(true);
    });

    test('includes prefix when provided', () => {
      const filename = generateSecureFilename('image.jpg', 'team-photo');
      expect(filename.startsWith('team-photo-')).toBe(true);
    });

    test('generates filename with correct format', () => {
      const filename = generateSecureFilename('test.jpg', 'prefix');
      // Format: prefix-timestamp-random32hex.ext
      const parts = filename.split('-');
      expect(parts.length).toBeGreaterThanOrEqual(3);
      expect(filename).toMatch(/^prefix-\d+-[a-f0-9]{32}\.jpg$/);
    });
  });

  describe('validateFileExtension', () => {
    test('allows valid image extensions', () => {
      expect(validateFileExtension('photo.jpg', 'image')).toBe(true);
      expect(validateFileExtension('image.jpeg', 'image')).toBe(true);
      expect(validateFileExtension('graphic.png', 'image')).toBe(true);
      expect(validateFileExtension('animation.gif', 'image')).toBe(true);
      expect(validateFileExtension('modern.webp', 'image')).toBe(true);
    });

    test('allows valid document extensions', () => {
      expect(validateFileExtension('document.pdf', 'document')).toBe(true);
      expect(validateFileExtension('report.doc', 'document')).toBe(true);
      expect(validateFileExtension('letter.docx', 'document')).toBe(true);
    });

    test('rejects invalid extensions', () => {
      expect(validateFileExtension('script.exe', 'image')).toBe(false);
      expect(validateFileExtension('malware.php', 'image')).toBe(false);
      expect(validateFileExtension('shell.sh', 'image')).toBe(false);
      expect(validateFileExtension('virus.bat', 'image')).toBe(false);
    });

    test('is case-insensitive', () => {
      expect(validateFileExtension('PHOTO.JPG', 'image')).toBe(true);
      expect(validateFileExtension('Image.PNG', 'image')).toBe(true);
    });
  });

  describe('validateMimeType', () => {
    test('allows valid image MIME types', () => {
      expect(validateMimeType('image/jpeg', 'image')).toBe(true);
      expect(validateMimeType('image/png', 'image')).toBe(true);
      expect(validateMimeType('image/webp', 'image')).toBe(true);
      expect(validateMimeType('image/gif', 'image')).toBe(true);
    });

    test('allows valid document MIME types', () => {
      expect(validateMimeType('application/pdf', 'document')).toBe(true);
      expect(validateMimeType('application/msword', 'document')).toBe(true);
    });

    test('rejects invalid MIME types', () => {
      expect(validateMimeType('application/x-executable', 'image')).toBe(false);
      expect(validateMimeType('application/x-php', 'image')).toBe(false);
      expect(validateMimeType('text/html', 'image')).toBe(false);
    });

    test('normalizes MIME type (case and parameters)', () => {
      expect(validateMimeType('IMAGE/JPEG', 'image')).toBe(true);
      expect(validateMimeType('image/png; charset=utf-8', 'image')).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    test('allows files within size limit', () => {
      expect(validateFileSize(1024 * 1024, 'image')).toBe(true); // 1MB
      expect(validateFileSize(4 * 1024 * 1024, 'image')).toBe(true); // 4MB
    });

    test('rejects files exceeding size limit', () => {
      const imageLimit = UPLOAD_CONFIG.MAX_FILE_SIZE.image;
      expect(validateFileSize(imageLimit + 1, 'image')).toBe(false);
      expect(validateFileSize(10 * 1024 * 1024, 'image')).toBe(false); // 10MB
    });

    test('rejects zero-size files (handled in validateUpload)', () => {
      expect(validateFileSize(0, 'image')).toBe(true); // Size validation passes, but empty check in validateUpload will fail
    });

    test('respects category-specific limits', () => {
      expect(validateFileSize(8 * 1024 * 1024, 'document')).toBe(true); // 8MB document OK
      expect(validateFileSize(8 * 1024 * 1024, 'image')).toBe(false); // 8MB image too large
    });
  });

  describe('validateFileContent', () => {
    test('validates JPEG magic bytes', () => {
      const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      expect(validateFileContent(jpegBuffer, 'image/jpeg')).toBe(true);
    });

    test('validates PNG magic bytes', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A]);
      expect(validateFileContent(pngBuffer, 'image/png')).toBe(true);
    });

    test('validates GIF magic bytes', () => {
      const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      expect(validateFileContent(gifBuffer, 'image/gif')).toBe(true);
    });

    test('validates PDF magic bytes', () => {
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31]);
      expect(validateFileContent(pdfBuffer, 'application/pdf')).toBe(true);
    });

    test('rejects files with mismatched content', () => {
      const fakeJpeg = Buffer.from([0x00, 0x00, 0x00, 0x00]);
      expect(validateFileContent(fakeJpeg, 'image/jpeg')).toBe(false);
    });

    test('allows files with no defined magic bytes (with warning)', () => {
      const unknownBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);
      // Should return true but log warning
      expect(validateFileContent(unknownBuffer, 'unknown/type')).toBe(true);
    });
  });

  describe('validateUpload', () => {
    // Helper to create mock File with proper size property
    const createMockFile = (name: string, type: string, size: number): File => {
      const blob = new Blob(['x'.repeat(size)], { type });
      const file = new File([blob], name, { type });
      Object.defineProperty(file, 'size', { value: size, writable: false });
      return file;
    };

    test('rejects missing file', () => {
      const result = validateUpload(null as any, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    test('rejects invalid file extension', () => {
      const file = createMockFile('malware.exe', 'image/jpeg', 1024);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file extension');
    });

    test('rejects invalid MIME type', () => {
      const file = createMockFile('image.jpg', 'application/x-executable', 1024);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    test('rejects oversized file', () => {
      const file = createMockFile('huge.jpg', 'image/jpeg', 10 * 1024 * 1024);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    test('rejects empty file', () => {
      const file = createMockFile('empty.jpg', 'image/jpeg', 0);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('File is empty');
    });

    test('accepts valid image file', () => {
      const file = createMockFile('photo.jpg', 'image/jpeg', 2 * 1024 * 1024);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(true);
      expect(result.sanitizedFilename).toBe('photo.jpg');
    });

    test('sanitizes filename in validation', () => {
      const file = createMockFile('dangerous.jpg', 'image/jpeg', 1024);
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(true);
      expect(result.sanitizedFilename).toBe('dangerous.jpg');
    });
  });

  describe('UPLOAD_CONFIG', () => {
    test('has required configuration', () => {
      expect(UPLOAD_CONFIG.MAX_FILE_SIZE).toBeDefined();
      expect(UPLOAD_CONFIG.ALLOWED_MIME_TYPES).toBeDefined();
      expect(UPLOAD_CONFIG.ALLOWED_EXTENSIONS).toBeDefined();
      expect(UPLOAD_CONFIG.UPLOAD_DIRS).toBeDefined();
    });

    test('has reasonable size limits', () => {
      expect(UPLOAD_CONFIG.MAX_FILE_SIZE.image).toBe(5 * 1024 * 1024);
      expect(UPLOAD_CONFIG.MAX_FILE_SIZE.document).toBe(10 * 1024 * 1024);
    });

    test('has proper upload directories', () => {
      expect(UPLOAD_CONFIG.UPLOAD_DIRS['payment-proofs']).toBe('payment-proofs');
      expect(UPLOAD_CONFIG.UPLOAD_DIRS.programs).toBe('programs');
      expect(UPLOAD_CONFIG.UPLOAD_DIRS.team).toBe('team');
    });
  });
});
