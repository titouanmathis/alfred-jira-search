const childProcess = require('child_process');

const alfred = require('./utils/get-alfred');
const config = require('./utils/get-config');
const data = require('./utils/get-data-config');

if (!(config.get('org') && config.get('token') && config.get('username'))) {
  return alfred.output(
    [
      {
        title: 'The workflow is not configured yet.',
        subtitle: 'Press ↩︎ to configure the required values.',
        arg: 'jconf',
      },
    ],
    {
      variables: config.store,
    }
  );
}

// Update data in the background
const child = childProcess.spawn('./node_modules/.bin/run-node', ['get-data.js'], {
  detached: true,
  stdio: 'ignore',
});
child.unref();

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
