const alfred = require('./utils/get-alfred');
const config = require('./utils/get-config');
const data = require('./utils/get-data-config');
const runBackground = require('./utils/run-background');

// Check the latest version
runBackground('check-version.js');

if (!(config.get('org') && config.get('token') && config.get('username'))) {
  return alfred.output(
    [
      {
        title: 'The workflow is not configured yet.',
        subtitle: 'Press ⏎ to configure the required values.',
        arg: 'conf',
      },
    ],
    {
      variables: config.store,
    }
  );
}

let items = [];

if (config.get('shouldUpdate')) {
  items.push({
    title: 'A new version is available',
    subtitle: 'Press ⏎ to install it automatically or ⌘+⏎ to open the releases page',
    arg: 'update',
    mods: {
      cmd: {
        subtitle: 'Press ⏎ to open the workflow releases page',
        arg: 'https://github.com/titouanmathis/alfred-jira-search/releases',
      },
    },
  });
}

// Update data in the background
runBackground('get-data.js');

const issues = data.get('items') || [];

if (!issues.length) {
  items.push({
    title: `No results for "${alfred.input}"`,
    subtitle: 'Open your query as a JQL search in Jira →',
    arg: `https://${config.get('org')}.atlassian.net/issues/?jql=${alfred.input}`,
  });
} else if (items.length) {
  // Remove uid to avoid sorting when there is an update
  items = items.concat(issues.map(({ uid, ...issue }) => issue));
} else {
  items = items.concat(issues);
}

alfred.output(items, { rerun: 5, variables: config.store });
