export default function getAverageVolume(array) {
  let values = 0;
  const { length } = array;
  let result;

  for (let i = 0; i < length; i += 1) {
    if (values < array[i]) {
      values = array[i];
    }
  }
  result = 20 * (Math.log10(values) / Math.log10(7));
  result = Math.floor(result * 100) / 100;
  return result === -Infinity ? 0 : result;
}
