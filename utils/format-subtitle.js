const formatTime = require('./format-time');

/**
 * Format the subtitle of an item based on the fields of an issue.
 *
 * @param  {Object} options.status       The status of the issue
 * @param  {Object} options.assignee     The person this issue is assigned to
 * @param  {Object} options.timespent    The time spent on the tasks
 * @param  {Object} options.timeestimate The estimated time to spend on the task
 * @return {String}                      A formatted string
 */
function formatSubtitle({ status, assignee, timespent, timeestimate }) {
  const subtitle = [status.name, assignee ? assignee.displayName : 'unassigned'];

  if (timespent || timeestimate) {
    subtitle.push(`${formatTime(timespent) || '…'} / ${formatTime(timeestimate) || '…'}`);
  }

  return subtitle.join(' → ');
}

module.exports = formatSubtitle;
