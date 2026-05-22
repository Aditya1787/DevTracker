/**
 * Formats an ISO date string into a human-readable format.
 * e.g., '2026-05-22T07:23:50Z' -> 'May 22, 2026'
 * 
 * @param {string|Date} dateString - The date value to format
 * @param {boolean} includeTime - Whether to include hours and minutes
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-US', options);
};

/**
 * Returns a human-friendly "time ago" string.
 * e.g., "3 hours ago", "2 days ago"
 * 
 * @param {string|Date} dateString - The date value to calculate
 * @returns {string} Time ago string
 */
export const timeAgo = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

  return 'just now';
};
