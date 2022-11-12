export default function getCoinPathFromResourceType(type: string) {
  const firstIndex = type.indexOf(`<`);
  const lastIndex = type.lastIndexOf(`>`);
  const path = type.substring(firstIndex + 1, lastIndex);
  return path;
}
