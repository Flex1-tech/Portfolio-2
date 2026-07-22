/**
 * Cloudinary URL Optimization Utility
 *
 * Injects Cloudinary transformation parameters into existing secure_url strings.
 * Non-destructive: if the URL is not a Cloudinary URL, it is returned as-is.
 *
 * Usage:
 *   import { getOptimizedImageUrl } from '@/lib/cloudinary';
 *   <img src={getOptimizedImageUrl(image_url, { width: 800 })} />
 */

const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

export interface CloudinaryTransformOptions {
  /** Target width in pixels */
  width?: number;
  /** Target height in pixels */
  height?: number;
  /**
   * Crop mode — see https://cloudinary.com/documentation/transformation_reference#c_crop_mode
   * Defaults to 'fill' when both width and height are provided.
   */
  crop?: 'fill' | 'fit' | 'pad' | 'scale' | 'thumb' | 'auto';
  /**
   * Format — 'auto' lets Cloudinary pick the best format (WebP, AVIF, etc.)
   * @default 'auto'
   */
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  /**
   * Quality — 'auto' applies smart compression without visible degradation.
   * @default 'auto'
   */
  quality?: 'auto' | 'auto:good' | 'auto:best' | number;
}

/**
 * Returns an optimized Cloudinary URL for an image.
 * Falls back gracefully to the original URL for non-Cloudinary sources.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: CloudinaryTransformOptions = {},
): string {
  if (!url) return '';

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }

  const { width, height, crop, format = 'auto', quality = 'auto' } = options;

  // Build transformation string
  const parts: string[] = [];

  parts.push(`f_${format}`);
  parts.push(`q_${quality}`);

  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);

  // Only add crop when dimensions are specified
  if ((width || height) && crop) {
    parts.push(`c_${crop}`);
  } else if (width && height) {
    // Default crop when both dimensions are set
    parts.push('c_fill');
  }

  const transformation = parts.join(',');

  // Insert transformation after '/upload/'
  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/`);
}

// ─── Pre-composed helpers for common use cases ───────────────────────────────

/**
 * Project card thumbnail — landscape, medium quality
 * 600×400 fill crop, auto format & quality
 */
export function getProjectThumbnail(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 600, height: 400, crop: 'fill' });
}

/**
 * Article hero image — large width, preserve aspect ratio
 * 1200px wide, auto format & quality
 */
export function getArticleHeroImage(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 1200 });
}

/**
 * Article list thumbnail — medium width, cropped height
 * 800×450 fill crop for consistent card heights
 */
export function getArticleThumbnail(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 800, height: 450, crop: 'fill' });
}

/**
 * Certification logo — small square, padded to preserve aspect ratio
 * 120×120 pad crop so logos are not distorted
 */
export function getCertificationLogo(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 120, height: 120, crop: 'pad' });
}
