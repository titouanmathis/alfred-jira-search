
const axios = require('axios');
const svg2png = require('svg-png-converter');
const fs = require("fs")
const data = require('./get-data-config');

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


module.exports = (config, issues) =>
  issues.map(({ id, key, fields }) => ({
    uid: id,
    title: `${key} – ${fields.summary}`,
    subtitle: `${formatSubtitle(fields)}${ (fields.issuetype.description) ? " | " + fields.issuetype.description.substring(0,140)  : ""  }`,
    arg: `https://${config.get('org')}.atlassian.net/browse/${key}`,
    quicklookurl: `https://${config.get('org')}.atlassian.net/browse/${key}`,
    // icon: { type: 'png', path: `static/10500.png` },
    text: {
      copy: key,
    },
    valid: true,
    autocomplete: key,
    mods: {
      cmd: {
        subtitle: 'Copy the issue key whit ⌘+C',
      },
    },
    get icon() {
        let filePath = data.path + "."+  fields.issuetype.avatarId + ".png"
        if (fields.issuetype.avatarId){
            if (!fs.existsSync(filePath)) {
                axios.get(fields.issuetype.iconUrl).then(
                    res => {
                        svg2png.svg2png({
                            input: res.data.trim().replaceAll('16px','32px'),
                            encoding: 'raw',
                            format: 'png'
                        }).then(
                            img => {
                                fs.writeFile(filePath, img, 'ascii', res => {  } );
                            }
                        )
                    }
                )
            }
            return { type: 'png', path: filePath }
        }else
        {
            return { type: 'png', path: "./icon.png" }
        }

    },
    get match() {
      let projecSplit = key.split('-');
      const project = projecSplit.shift();
      const number = projecSplit.shift();
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

      return `${project} ${number} ${key} ${fields.summary} ${assignee} ${fields.status.name} `;
    },
  }));
