import { unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function saveImage(file: File, folder: string = 'general'): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
  }

  // Create upload directory if it doesn't exist
  const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', folder);
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const ext = file.name.split('.').pop();
  const filename = `${folder}-${timestamp}-${randomStr}.${ext}`;
  const filepath = join(UPLOAD_DIR, filename);

  // Save file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filepath, buffer);

  // Return just filename (not full path)
  return filename;
}

export async function deleteImage(filepath: string): Promise<void> {
  try {
    const fullPath = join(process.cwd(), 'public', filepath);
    await unlink(fullPath);
  } catch (error: any) {
    // Silently ignore if file doesn't exist (ENOENT)
    if (error.code !== 'ENOENT') {
      console.error('Failed to delete file:', error);
    }
  }
}
