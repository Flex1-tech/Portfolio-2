/**
 * slugify — DRY utility to generate URL-safe slugs from any string.
 * Handles accents, special characters, spaces and uppercase.
 *
 * Examples:
 *   slugify("Système de Covoiturage")  → "systeme-de-covoiturage"
 *   slugify("2FA Multi-Channel System") → "2fa-multi-channel-system"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")                        // decompose accented chars (é → e + ´)
    .replace(/[\u0300-\u036f]/g, "")         // strip accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")           // remove non-alphanumeric (except spaces/hyphens)
    .replace(/[\s_]+/g, "-")                 // spaces/underscores → hyphens
    .replace(/-{2,}/g, "-")                  // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");               // trim leading/trailing hyphens
}
