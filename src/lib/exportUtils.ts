/**
 * Export utilities for converting SVG to PNG and bundling assets
 */

import JSZip from 'jszip';

/**
 * Convert SVG string to PNG Blob
 */
export async function svgToPngBlob(
  svgString: string,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create blob from SVG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create image element
      const img = new Image();
      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/png');
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export configuration for iOS and Android sizes
 */
export interface ExportSize {
  label: string;
  size: number;
  platform: 'ios' | 'android';
}

export const iOS_SIZES: ExportSize[] = [
  { label: 'AppStore', size: 1024, platform: 'ios' },
  { label: '180px', size: 180, platform: 'ios' },
  { label: '120px', size: 120, platform: 'ios' },
  { label: '87px', size: 87, platform: 'ios' },
  { label: '60px', size: 60, platform: 'ios' },
  { label: '40px', size: 40, platform: 'ios' },
  { label: '29px', size: 29, platform: 'ios' },
];

export const ANDROID_SIZES: ExportSize[] = [
  { label: 'PlayStore', size: 512, platform: 'android' },
  { label: 'AdaptiveFG', size: 432, platform: 'android' },
  { label: 'AdaptiveBG', size: 432, platform: 'android' },
  { label: '48dp', size: 48, platform: 'android' },
  { label: '36dp', size: 36, platform: 'android' },
  { label: '24dp', size: 24, platform: 'android' },
];

/**
 * Generate filename for exported asset
 */
export function generateFilename(
  appName: string,
  variant: 'logo' | 'name',
  mode: 'light' | 'dark',
  size: number,
  platform: 'ios' | 'android'
): string {
  const sanitizedName = appName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${sanitizedName}-${variant}-${mode}-${size}px.png`;
}

/**
 * Build export zip with all assets
 */
export async function buildExportZip(
  svgGenerator: (size: number, variant: 'logo' | 'name', mode: 'light' | 'dark') => string,
  appName: string,
  platform: 'ios' | 'android'
): Promise<Blob> {
  const zip = new JSZip();
  const sizes = platform === 'ios' ? iOS_SIZES : ANDROID_SIZES;

  // Create platform folder
  const folder = zip.folder(platform) || zip;

  // Generate all variants
  const variants: Array<{ variant: 'logo' | 'name'; mode: 'light' | 'dark' }> = [
    { variant: 'logo', mode: 'light' },
    { variant: 'logo', mode: 'dark' },
    { variant: 'name', mode: 'light' },
    { variant: 'name', mode: 'dark' },
  ];

  // Process all combinations
  const promises: Promise<void>[] = [];

  for (const { variant, mode } of variants) {
    for (const sizeConfig of sizes) {
      const promise = (async () => {
        try {
          const svgString = svgGenerator(sizeConfig.size, variant, mode);
          const pngBlob = await svgToPngBlob(svgString, sizeConfig.size, sizeConfig.size);
          const filename = generateFilename(appName, variant, mode, sizeConfig.size, platform);
          folder.file(filename, pngBlob);
        } catch (error) {
          console.error(`Failed to generate ${variant}-${mode}-${sizeConfig.size}px:`, error);
        }
      })();
      promises.push(promise);
    }
  }

  await Promise.all(promises);

  // Generate zip
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Trigger download of a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
