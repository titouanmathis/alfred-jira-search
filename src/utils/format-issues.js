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
  const subtitle = [status.name.trim(), assignee ? assignee.displayName : 'unassigned'];

  if (timespent || timeestimate) {
    subtitle.push(`${formatTime(timespent) || '…'} / ${formatTime(timeestimate) || '…'}`);
  }

  return subtitle.join(' → ');
}

/**
 * Replace unicode spaces with regular spaces from a string.
 * @param {string} str The string to modify.
 * @return {string} The modified string.
 */
function removeUnicodeSpaces(str) {
  return str.replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, ' ');
}

module.exports = (config, issues) =>
  issues.map(({ id, key, fields }) => ({
    uid: id,
    title: removeUnicodeSpaces(`${key} – ${fields.summary}`),
    subtitle: removeUnicodeSpaces(`${formatSubtitle(fields)}`),
    arg: `https://${config.get('org')}.atlassian.net/browse/${key}`,
    quicklookurl: `https://${config.get('org')}.atlassian.net/browse/${key}`,
    icon: { type: 'png', path: `static/${fields.issuetype.avatarId}.png` },
    text: {
      copy: key,
    },
    mods: {
      cmd: {
        subtitle: 'Copy the issue key whit ⌘+C',
      },
    },
    get match() {
      const project = key.split('-').shift();
      const assignee = fields.assignee ? fields.assignee.displayName : 'unassigned';

      // Add sprint state
      let sprint = '';
      if (Array.isArray(fields.customfield_10006)) {
        const latestSprintData = fields.customfield_10006.pop();
        if (latestSprintData && latestSprintData.state) {
          sprint = `sp=${latestSprintData.state}`;
        }
      }

      let account = '';
      if (fields['io.tempo.jira__account'] && fields['io.tempo.jira__account'].value) {
        account = `a=${fields['io.tempo.jira__account'].value}`;
      }

      return removeUnicodeSpaces(`p=${project} u=${assignee} s=${fields.status.name} ${account} ${sprint} ${key} ${fields.summary}`);
    },
  }));
