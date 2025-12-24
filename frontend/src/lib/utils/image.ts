const BACKEND_URL = 'http://localhost:3000';

/**
 * Get full image URL from relative path
 * @param imagePath - Relative or absolute image path
 * @returns Full image URL
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://placehold.co/400x300?text=No+Image';
  }
  
  // If already absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path, prepend backend URL
  return `${BACKEND_URL}${imagePath}`;
}
