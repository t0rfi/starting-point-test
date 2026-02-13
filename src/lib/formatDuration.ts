/**
 * Converts seconds into a human-readable duration string.
 *
 * @param durationSeconds - The duration in seconds (can be null/undefined)
 * @returns Formatted string (e.g., '2h 15m', '45m', '1h', '0m')
 *
 * @example
 * formatDuration(8100) // '2h 15m'
 * formatDuration(2700) // '45m'
 * formatDuration(3600) // '1h'
 * formatDuration(0)    // '0m'
 * formatDuration(null) // '-'
 */
export function formatDuration(
  durationSeconds: number | null | undefined
): string {
  if (durationSeconds === null || durationSeconds === undefined) {
    return "-";
  }

  if (durationSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
