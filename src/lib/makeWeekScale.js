import { NUM_OF_DAYS } from '../Constants';

const NOW = new Date();
const DATE = NOW.getDate();
const MONTH = NOW.getMonth() + 1;
const PRE_MONTH = MONTH - 1 > 0 ? MONTH - 1 : MONTH + 11;
const PRE_PRE_MONTH = MONTH - 2 > 0 ? MONTH - 2 : MONTH + 10;
const PRE_PRE_PRE_MONTH = MONTH - 3 > 0 ? MONTH - 3 : MONTH + 9;

export default function makeWeekScale() {
  const result = [];
  const scale = [];
  const day = 6 - NOW.getDay();
  const baseDate = DATE + day;
  let days;

  for (let i = 0; i <= 11; i += 1) {
    const targetDay = baseDate - 7 * i;
    if (targetDay > 0) {
      scale.unshift(`${MONTH}/${targetDay}`);
      result.unshift({ month: MONTH, date: targetDay, y: 0 });
    } else if (targetDay > -30) {
      days = NUM_OF_DAYS[`${PRE_MONTH}`];
      scale.unshift(`${PRE_MONTH}/${targetDay + days}`);
      result.unshift({
        month: PRE_MONTH,
        date: targetDay + days,
        y: 0
      });
    } else if (targetDay > -60) {
      days = NUM_OF_DAYS[`${PRE_MONTH}`] + NUM_OF_DAYS[`${PRE_PRE_MONTH}`];
      scale.unshift(`${PRE_PRE_MONTH}/${targetDay + days}`);
      result.unshift({
        month: PRE_PRE_MONTH,
        date: targetDay + days,
        y: 0
      });
    } else {
      days =
        NUM_OF_DAYS[`${PRE_MONTH}`] +
        NUM_OF_DAYS[`${PRE_PRE_MONTH}`] +
        NUM_OF_DAYS[`${PRE_PRE_PRE_MONTH}`];
      scale.unshift(`${PRE_PRE_PRE_MONTH}/${targetDay + days}`);
      result.unshift({
        month: PRE_PRE_PRE_MONTH,
        date: targetDay + days,
        y: 0
      });
    }
  }
  return { result, scale };
}
