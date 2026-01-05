/**
 * Compresses an image to a smaller size for localStorage storage
 * Returns a compressed base64 string
 */
export async function compressImageForStorage(base64: string, maxWidth = 400, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to JPEG with compression
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => {
      // If compression fails, return original
      resolve(base64);
    };
    img.src = base64;
  });
}

/**
 * Compresses multiple images for storage
 */
export async function compressImagesForStorage(images: string[]): Promise<string[]> {
  return Promise.all(images.map(img => compressImageForStorage(img)));
}
