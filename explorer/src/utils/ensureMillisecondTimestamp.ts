/* eslint-disable radix */
/* eslint-disable no-param-reassign */

export default function ensureMillisecondTimestamp(timestamp: string): number {
  if (timestamp.length > 13) {
    timestamp = timestamp.slice(0, 13);
  }
  if (timestamp.length === 10) {
    timestamp += `000`;
  }
  return parseInt(timestamp);
}
