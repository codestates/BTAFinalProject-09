export default function truncate(
  str: string,
  frontLen: number,
  backLen: number,
  truncateStr = `...`,
) {
  if (!str) {
    return ``;
  }

  if (!Number.isInteger(frontLen) || !Number.isInteger(backLen)) {
    throw new Error(`${frontLen} and ${backLen} should be an Integer`);
  }

  const strLen = str.length;
  if (
    (frontLen === 0 && backLen === 0) ||
    frontLen >= strLen ||
    backLen >= strLen ||
    frontLen + backLen >= strLen
  ) {
    return str;
  }
  if (backLen === 0) {
    return str.slice(0, frontLen) + truncateStr;
  }
  return str.slice(0, frontLen) + truncateStr + str.slice(strLen - backLen);
}
