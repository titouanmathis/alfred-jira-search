require('dotenv').config();
const pkg = require('./package.json');
const formatSubtitle = require('./utils/format-subtitle');
const Alfred = require('./utils/alfred');

const alfred = new Alfred({ name: `${pkg.name}@${pkg.version}` });

const config = {
  org: process.env.JIRA_ORG,
  baseUrl: `https://${process.env.JIRA_ORG}.atlassian.net/rest/api/3/search`,
  token: process.env.JIRA_ACCESS_TOKEN,
  username: process.env.JIRA_USERNAME,
};

/**
 * @see https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-functions/
 * @see https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-fields/
 * @see https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-keywords/
 * @see https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-operators/
 */
let query;

const MATCH_ISSUE_REGEX = /^[a-zA-Z]+-[0-9]+$/;
const FILTER_PROJECT_REGEX = /^p\s([a-zA-Z]+)\s?(\s.+)?$/;

const TYPES = {
  CURRENT_USER: 'CURRENT_USER',
  ISSUE_KEY: 'ISSUE_KEY',
  PROJECT_KEY: 'PROJECT_KEY',
  TEXT: 'TEXT',
};
let type = '';

if (!alfred.input || alfred.input.length < 3) {
  query = `
    assignee = currentUser()
    AND resolution = Unresolved
    ORDER BY updated DESC
  `;
  type = TYPES.CURRENT_USER;
} else if (alfred.input.trim().match(MATCH_ISSUE_REGEX)) {
  const key = alfred.input.trim().toLowerCase();
  query = `
      issue = '${key}'
      OR issue = '${key}0'
      OR issue = '${key}1'
      OR issue = '${key}2'
      OR issue = '${key}3'
      OR issue = '${key}4'
      OR issue = '${key}5'
      OR issue = '${key}6'
      OR issue = '${key}7'
      OR issue = '${key}8'
      OR issue = '${key}9'
      ORDER BY updated DESC
    `;
  type = TYPES.ISSUE_KEY;
} else if (alfred.input.trim().match(FILTER_PROJECT_REGEX)) {
  const [, project, search] = alfred.input.trim().match(FILTER_PROJECT_REGEX);
  query = [search ? `text ~ '${search}'` : false, `project = '${project}' ORDER BY updated DESC`]
    .filter(p => p)
    .join(' AND ');
  type = TYPES.PROJECT_KEY;
} else {
  query = `
      text ~ '${alfred.input}' ORDER BY updated DESC
    `;
  type = TYPES.TEXT;
}

query = query.trim();

const url = `${config.baseUrl}?jql=${encodeURI(query)}&maxResults=20`;

/**
 * Output a "no result" item.
 */
function fail() {
  let title = `No results for "${alfred.input}"...`;

  if (type === TYPES.PROJECT_KEY) {
    const input = alfred.input.replace(/^p\s/, '');
    title = `No project found matching "${input}"...`;
  }

  alfred.output([
    {
      title,
      subtitle: 'Open the JQL search in Jira →',
      arg: `https://${config.org}.atlassian.net/issues/?jql=${query}`,
    },
  ]);
}

alfred
  .fetch(url, {
    auth: {
      username: config.username,
      password: config.token,
    },
  })
  .then(response => {
    if (!response || !response.issues || response.issues.length <= 0) {
      return fail();
    }

    const items = response.issues.map(({ id, key, fields }) => ({
      uid: id,
      title: `${key} – ${fields.summary}`,
      subtitle: formatSubtitle(fields),
      arg: `https://${config.org}.atlassian.net/browse/${key}`,
      quicklookurl: `https://${config.org}.atlassian.net/browse/${key}`,
      icon: { type: 'png', path: `static/${fields.issuetype.avatarId}.png` },
    }));

    return alfred.output(items);
  })
  .catch(fail);

// TODO
// - filter list of actions for a ticket
//   * open ticket
//   * open parent epic
//   * open parent version
//   * change status
//   * log time
// - when activating an epic, display a list of its story
// - allow search by version
// - allow search by project
