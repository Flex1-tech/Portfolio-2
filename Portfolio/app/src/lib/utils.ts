import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string (e.g. "2025-12-20T00:00:00.000Z" or "2025-12-20")
 * into a clean "DD/MM/YYYY" format without time.
 */
export function formatCertDate(dateStr?: string | null): string {
  if (!dateStr) return '';

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');

  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year.length === 4 && month && day) {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  return dateStr;
}

