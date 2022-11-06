import truncate from './truncate';

export default function truncateAddress(accountAddress: string) {
  return truncate(accountAddress, 6, 4, `…`);
}
