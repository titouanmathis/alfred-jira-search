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

if (config.get('shouldUpdate')) {
  return alfred.output(
    [
      {
        title: '🎉 A new version is available!',
        subtitle: 'Press ⏎ to install it automatically.',
        arg: 'update',
      },
    ],
    { variables: config.store }
  );
}

// Update data in the background
runBackground('get-data.js');

const issues = data.get('items') || [];

if (!issues.length) {
  return alfred.output([
    {
      title: `No results for "${alfred.input}"...`,
      subtitle: 'Open your query as a JQL search in Jira →',
      arg: `https://${config.get('org')}.atlassian.net/issues/?jql=${alfred.input}`,
    },
  ]);
}

return alfred.output(issues, { rerun: 10 });
