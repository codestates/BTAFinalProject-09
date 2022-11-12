export default function getCoinPathFromResourceType(type: string) {
  const result = type.match(/<(.*?)>/);
  if (!result) {
    return ``;
  }
  const fullpath = result[1];
  return fullpath;
}
