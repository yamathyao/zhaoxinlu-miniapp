function pad(value) {
  return String(value).padStart(2, "0");
}

function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function compareDateKey(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function isBeforeDateKey(left, right) {
  return compareDateKey(left, right) < 0;
}

function isAfterDateKey(left, right) {
  return compareDateKey(left, right) > 0;
}

function formatDisplayDate(dateKey = getDateKey()) {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

module.exports = {
  getDateKey,
  compareDateKey,
  isBeforeDateKey,
  isAfterDateKey,
  formatDisplayDate,
};
