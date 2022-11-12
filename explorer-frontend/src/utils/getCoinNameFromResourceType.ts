import getCoinPathFromResourceType from './getCoinPathFromResourceType';

export default function getCoinNameFromResourceType(type: string) {
  const name = getCoinPathFromResourceType(type).split(`::`)[2];
  return name;
}
