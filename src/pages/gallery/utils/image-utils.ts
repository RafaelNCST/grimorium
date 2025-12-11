/**
 * Gera um thumbnail de uma imagem usando Canvas API
 * @param imageSrc - Source da imagem (data URL ou file path)
 * @param maxWidth - Largura máxima do thumbnail (default: 400px)
 * @param maxHeight - Altura máxima do thumbnail (default: 400px)
 * @returns Promise com data URL do thumbnail em JPEG 80% quality
 */
export async function generateThumbnail(
  imageSrc: string,
  maxWidth: number = 400,
  maxHeight: number = 400
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Calculate aspect ratio
      let { width } = img;
      let { height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => reject(new Error("Failed to read blob"));
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.8 // 80% quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });
}

/**
 * Obtém as dimensões originais de uma imagem
 * @param imageSrc - Source da imagem (data URL ou file path)
 * @returns Promise com width e height da imagem original
 */
export async function getImageDimensions(
  imageSrc: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });
}

/**
 * Valida se o MIME type é de um formato de imagem suportado
 * @param mimeType - MIME type do arquivo
 * @returns true se o formato é válido
 */
export function isValidImageFormat(mimeType: string): boolean {
  const validFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  return validFormats.includes(mimeType.toLowerCase());
}

/**
 * Formata o tamanho de um arquivo em bytes para uma string legível
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "1.5 MB", "234 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Extrai a extensão do arquivo a partir do MIME type
 * @param mimeType - MIME type do arquivo
 * @returns Extensão do arquivo sem o ponto (ex: "jpg", "png")
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return mimeToExt[mimeType.toLowerCase()] || "jpg";
}

/**
 * Determina o MIME type a partir da extensão do arquivo
 * @param extension - Extensão do arquivo sem o ponto (ex: "jpg", "png")
 * @returns MIME type do arquivo
 */
export function getMimeTypeFromExtension(extension: string): string {
  const extToMime: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  return extToMime[extension.toLowerCase()] || "image/jpeg";
}

/**
 * Converte um File para data URL (base64)
 * @param file - Arquivo a ser convertido
 * @returns Promise com data URL do arquivo
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Converte array de bytes em data URL
 * @param bytes - Array de bytes da imagem
 * @param mimeType - MIME type da imagem
 * @returns Data URL (base64)
 */
export function bytesToDataURL(bytes: Uint8Array, mimeType: string): string {
  // Process in chunks to avoid "Maximum call stack size exceeded"
  const CHUNK_SIZE = 8192; // 8KB chunks
  let binaryString = "";

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.slice(i, i + CHUNK_SIZE);
    binaryString += String.fromCharCode(...chunk);
  }

  const base64 = btoa(binaryString);
  return `data:${mimeType};base64,${base64}`;
}
