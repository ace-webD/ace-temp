/**
 * Get the site URL based on environment
 * Automatically handles development vs production URLs
 */
export function getSiteUrl(): string {
  // If we're in production, use the production URL
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION || 'https://ace-temp.vercel.app';
  }
  
  // If we're in development, use the development URL
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Get the absolute URL for a given path
 * @param path - The path to append to the site URL (should start with /)
 */
export function getAbsoluteUrl(path: string = ''): string {
  const baseUrl = getSiteUrl();
  return `${baseUrl}${path}`;
}

/**
 * Configuration constants
 */
export const CONFIG = {
  site: {
    name: 'ACE SASTRA',
    description: 'ACE is a student-run club established with the aim of promoting excellence in computing education and research.',
    url: getSiteUrl(),
  },
  social: {
    twitter: '@acesastra', 
    linkedin: 'company/association-of-computing-engineers', 
  },
} as const;
