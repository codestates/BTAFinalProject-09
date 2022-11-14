export default function isNumeric(text: string) {
  return /^-?\d+$/.test(text);
}
