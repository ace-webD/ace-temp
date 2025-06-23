/**
 * Formats a date string into a readable format with ordinal suffix
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "1st Jan 2024")
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  
  const daySuffix = getDaySuffix(day);
  return `${day}${daySuffix} ${month} ${year}`;
}

/**
 * Gets the ordinal suffix for a day number
 * @param day - Day number (1-31)
 * @returns Ordinal suffix ('st', 'nd', 'rd', 'th')
 */
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Extracts unique years from events, sorted in descending order
 * @param events - Array of events with startTime property
 * @returns Array of unique years sorted descending
 */
export function extractAvailableYears<T extends { startTime: string }>(events: T[]): number[] {
  if (!events?.length) return [];
  
  const years = new Set(
    events.map(event => new Date(event.startTime).getFullYear())
  );
  
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Filters events by year
 * @param events - Array of events with startTime property
 * @param year - Year to filter by
 * @returns Filtered events array
 */
export function filterEventsByYear<T extends { startTime: string }>(
  events: T[], 
  year: number | null
): T[] {
  if (!events?.length || !year) return [];
  
  return events.filter(
    event => new Date(event.startTime).getFullYear() === year
  );
}
