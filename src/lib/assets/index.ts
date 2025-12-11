// Basic asset management for Grimorium
// For now, we'll use base64 encoding to store images directly in the database
// In the future, this can be enhanced to use file system storage

/**
 * Save an image by returning the base64 string
 * In the future, this could save to disk and return a file path
 * @param base64 Base64 encoded image string
 * @param filename Optional filename for future file system storage
 * @returns The base64 string or file path
 */
export async function saveImage(
  base64: string,
  filename?: string
): Promise<string> {
  // For now, just return the base64 string
  // In future, could save to app data directory using Tauri's fs API
  return base64;
}

/**
 * Load an image from a path or base64 string
 * @param path File path or base64 string
 * @returns Base64 string for display
 */
export async function loadImage(path: string): Promise<string> {
  // For now, assuming path is already base64
  // In future, could read from file system if path starts with file://
  return path;
}

/**
 * Delete an image from storage
 * @param path File path or identifier
 */
export async function deleteImage(path: string): Promise<void> {
  // For now, nothing to do since we're using base64
  // In future, could delete from file system
}

/**
 * Check if a path is a base64 encoded image
 * @param path Path or base64 string to check
 */
export function isBase64Image(path: string): boolean {
  return path.startsWith("data:image/");
}

/**
 * Convert a File object to base64
 * @param file File object from input
 * @returns Promise with base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
