import dayjs from 'dayjs';
import ensureMillisecondTimestamp from './ensureMillisecondTimestamp';

export default function parseTimestamp(timestamp: string): dayjs.Dayjs {
  return dayjs(ensureMillisecondTimestamp(timestamp));
}
