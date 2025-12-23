import { describe, test, expect } from 'bun:test';
import { savePaymentProof, deletePaymentProof } from '../utils/upload';
import { unlink } from 'fs/promises';

describe('File Upload Tests', () => {
  test('savePaymentProof - should reject file exceeding size limit', async () => {
    // Create mock file > 5MB
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg'
    });

    await expect(savePaymentProof(largeFile)).rejects.toThrow('File size exceeds 5MB limit');
  });

  test('savePaymentProof - should reject invalid file type', async () => {
    const invalidFile = new File(['test'], 'test.pdf', {
      type: 'application/pdf'
    });

    await expect(savePaymentProof(invalidFile)).rejects.toThrow('Invalid file type');
  });

  test('savePaymentProof - should accept valid JPEG file', async () => {
    const validFile = new File(['test image data'], 'test.jpg', {
      type: 'image/jpeg'
    });

    const path = await savePaymentProof(validFile);
    
    expect(path).toContain('/uploads/payment-proofs/');
    expect(path).toContain('.jpg');
    
    // Cleanup
    await deletePaymentProof(path);
  });

  test('savePaymentProof - should accept valid PNG file', async () => {
    const validFile = new File(['test image data'], 'test.png', {
      type: 'image/png'
    });

    const path = await savePaymentProof(validFile);
    
    expect(path).toContain('/uploads/payment-proofs/');
    expect(path).toContain('.png');
    
    // Cleanup
    await deletePaymentProof(path);
  });

  test('savePaymentProof - should accept valid WebP file', async () => {
    const validFile = new File(['test image data'], 'test.webp', {
      type: 'image/webp'
    });

    const path = await savePaymentProof(validFile);
    
    expect(path).toContain('/uploads/payment-proofs/');
    expect(path).toContain('.webp');
    
    // Cleanup
    await deletePaymentProof(path);
  });

  test('savePaymentProof - should generate unique filenames', async () => {
    const file1 = new File(['test1'], 'test.jpg', { type: 'image/jpeg' });
    const file2 = new File(['test2'], 'test.jpg', { type: 'image/jpeg' });

    const path1 = await savePaymentProof(file1);
    const path2 = await savePaymentProof(file2);
    
    expect(path1).not.toBe(path2);
    
    // Cleanup
    await deletePaymentProof(path1);
    await deletePaymentProof(path2);
  });

  test('deletePaymentProof - should handle non-existent file gracefully', async () => {
    // Should not throw error
    await expect(deletePaymentProof('/uploads/non-existent.jpg')).resolves.toBeUndefined();
  });

  test('savePaymentProof - should preserve file extension', async () => {
    const jpegFile = new File(['test'], 'myimage.jpeg', { type: 'image/jpeg' });
    const path = await savePaymentProof(jpegFile);
    
    expect(path.endsWith('.jpeg')).toBe(true);
    
    // Cleanup
    await deletePaymentProof(path);
  });
});
