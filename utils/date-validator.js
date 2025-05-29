function isValidFutureDate(date, time) {
  if (typeof date !== 'string') return false;

  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  let hour = 0, minute = 0;
  if (typeof time === 'string' && time.includes(':')) {
    [hour, minute] = time.split(':').map(Number);
  }

  const dateObj = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  if (isNaN(dateObj.getTime())) return false;

  return dateObj > now;
}

module.exports = { isValidFutureDate };
