import { API_URL } from '@/services/api';

/**
 * Downloads CV dynamically using a Blob transfer to ensure custom download filenames
 * and bypass any cross-origin restrictions.
 *
 * @param cvUrl Remote Cloudinary URL or fallback path
 * @param username Name of the user to use in the filename
 */
export async function downloadCV(cvUrl: string | undefined, username: string) {
  try {
    // If the URL is an external web link, fetch it via the backend download proxy
    // to bypass CORS limits. Otherwise, read local fallback file directly.
    const targetUrl = cvUrl && cvUrl.startsWith('http')
      ? `${API_URL}/api/profile/cv/download`
      : '/CV_Seth_AKPLOGAN.pdf';

    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CV: ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;

    // Sanitize dynamic filename
    const sanitizedName = username.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    link.download = `CV_${sanitizedName}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading CV:', error);
    // Safe fallback if fetch fails
    const fallbackUrl = cvUrl || '/CV_Seth_AKPLOGAN.pdf';
    window.open(fallbackUrl, '_blank');
  }
}
