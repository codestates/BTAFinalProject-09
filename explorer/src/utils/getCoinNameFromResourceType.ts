import getCoinPathFromResourceType from './getCoinPathFromResourceType';

export default function getCoinNameFromResourceType(type: string) {
  const path = getCoinPathFromResourceType(type);
  let name = path.split(`::`)[2].split(`<`)[0];
  // Pair 코인의 경우
  if (path.indexOf(`<`) > -1) {
    const [lp1, lp2] = getCoinPathFromResourceType(path).split(`, `);
    const lp1Name = lp1.split(`::`)[2];
    const lp2Name = lp2.split(`::`)[2];
    name = `${name}<${lp1Name}, ${lp2Name}>`;
  }
  return name;
}
