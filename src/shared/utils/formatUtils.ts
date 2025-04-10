/**
 * Formats playtime from seconds into a readable string (e.g., "1h 23m 45s").
 * @param {number} totalSeconds - The total playtime in seconds.
 * @returns {string} Formatted playtime string.
 */
export const formatPlaytime = (totalSeconds: number = 0): string => {
  if (totalSeconds < 0) {
    return "0s";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) { // Show minutes if hours are shown or if minutes > 0
    result += `${minutes}m `;
  }
  result += `${seconds}s`;

  return result.trim();
};

/**
 * Formats a timestamp into a readable date and time string.
 * @param {number} timestamp - The timestamp (milliseconds since epoch).
 * @returns {string} Formatted date string (e.g., "MM/DD/YYYY, HH:MM:SS AM/PM").
 */
export const formatSaveDate = (timestamp: number = Date.now()): string => {
  if (timestamp <= 0) {
    return "Invalid Date";
  }
  const date = new Date(timestamp);
  return date.toLocaleString(); // Uses locale-specific format
};
