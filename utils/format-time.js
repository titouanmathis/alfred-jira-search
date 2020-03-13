/**
 * Format seconds to a nice hour + min format.
 *
 * @param  {Number} seconds The time in secondes
 * @return {String}         A formatted time
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);

  const time = [];
  if (hours > 0) {
    time.push(`${hours}h`);
  }

  if (minutes > 0) {
    time.push(`${minutes}min`);
  }

  return time.join(' ');
}

module.exports = formatTime;
