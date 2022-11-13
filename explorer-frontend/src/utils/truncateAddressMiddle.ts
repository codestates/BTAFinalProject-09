import truncate from './truncate';

export default function truncateAddressMiddle(accountAddress: string) {
  return truncate(accountAddress, 20, 20, `…`);
}
