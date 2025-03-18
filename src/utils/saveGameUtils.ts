/**
 * Utilities for formatting and handling save game data
 */

/**
 * Formats playtime in seconds to a readable format
 * @param seconds Total playtime in seconds
 * @returns Formatted playtime string (e.g. "2h 30m" or "45m")
 */
export function formatPlaytime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Formats a timestamp to a readable date
 * @param timestamp Timestamp to format (number or Date object)
 * @returns Formatted date string (e.g. "Jan 15, 2023 at 3:45 PM")
 */
export function formatSaveDate(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}
