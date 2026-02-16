/**
 * Utilities for screenshot processing and frame generation
 */

export interface ScreenshotFrame {
  id: string;
  imageUrl: string;
  deviceType?: "iphone" | "ipad" | "android";
  frameStyle?: "minimal" | "elegant" | "bold";
}

export interface FrameOptions {
  deviceType?: "iphone" | "ipad" | "android" | "none";
  frameStyle?: "minimal" | "elegant" | "bold";
  showShadow?: boolean;
  backgroundColor?: string;
}

/**
 * Convert File to data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image to fit within dimensions while maintaining aspect ratio
 */
export function resizeImage(
  imageUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * Generate device frame SVG path
 */
export function getDeviceFramePath(
  deviceType: "iphone" | "ipad" | "android",
  width: number,
  height: number
): string {
  const cornerRadius = deviceType === "iphone" ? 40 : deviceType === "ipad" ? 20 : 30;
  const notchWidth = deviceType === "iphone" ? 120 : 0;
  const notchHeight = deviceType === "iphone" ? 30 : 0;

  if (deviceType === "iphone" && notchWidth > 0) {
    // iPhone with notch
    return `
      M ${cornerRadius} 0
      L ${(width - notchWidth) / 2} 0
      Q ${width / 2 - notchWidth / 2 + 10} 0 ${width / 2 - notchWidth / 2 + 10} ${notchHeight / 2}
      L ${width / 2 - notchWidth / 2 + 10} ${notchHeight}
      Q ${width / 2} ${notchHeight} ${width / 2 + notchWidth / 2 - 10} ${notchHeight}
      L ${width / 2 + notchWidth / 2 - 10} ${notchHeight / 2}
      Q ${width / 2 + notchWidth / 2 - 10} 0 ${(width + notchWidth) / 2} 0
      L ${width - cornerRadius} 0
      Q ${width} 0 ${width} ${cornerRadius}
      L ${width} ${height - cornerRadius}
      Q ${width} ${height} ${width - cornerRadius} ${height}
      L ${cornerRadius} ${height}
      Q 0 ${height} 0 ${height - cornerRadius}
      L 0 ${cornerRadius}
      Q 0 0 ${cornerRadius} 0
      Z
    `;
  }

  // Standard rounded rectangle
  return `
    M ${cornerRadius} 0
    L ${width - cornerRadius} 0
    Q ${width} 0 ${width} ${cornerRadius}
    L ${width} ${height - cornerRadius}
    Q ${width} ${height} ${width - cornerRadius} ${height}
    L ${cornerRadius} ${height}
    Q 0 ${height} 0 ${height - cornerRadius}
    L 0 ${cornerRadius}
    Q 0 0 ${cornerRadius} 0
    Z
  `;
}

/**
 * Export image as PNG
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Create frame overlay canvas
 */
export function createFrameOverlay(
  imageUrl: string,
  options: FrameOptions,
  frameWidth: number,
  frameHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Calculate image dimensions to fit frame
      const aspectRatio = img.width / img.height;
      let imgWidth = frameWidth;
      let imgHeight = frameWidth / aspectRatio;

      if (imgHeight > frameHeight) {
        imgHeight = frameHeight;
        imgWidth = frameHeight * aspectRatio;
      }

      const x = (frameWidth - imgWidth) / 2;
      const y = (frameHeight - imgHeight) / 2;

      // Draw background
      ctx.fillStyle = options.backgroundColor || "#000000";
      ctx.fillRect(0, 0, frameWidth, frameHeight);

      // Draw image
      ctx.drawImage(img, x, y, imgWidth, imgHeight);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}
