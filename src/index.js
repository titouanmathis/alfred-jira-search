const alfred = require('./utils/get-alfred');
const config = require('./utils/get-config');
const testConfig = require('./utils/test-config');
const { testUpdate, getUpdateItem } = require('./utils/test-update');
const data = require('./utils/get-data-config');
const runBackground = require('./utils/run-background');

(() => {
  testConfig();

  let items = [];

  const hasUpdate = testUpdate();
  if (hasUpdate) {
    items.push(getUpdateItem());
  }

  // Update data in the background
  runBackground('update-data.js');

  const issues = data.get('items') || [];

  if (!issues.length) {
    items.push({
      title: `There is no issue matching  "${alfred.input}"`,
      subtitle: 'Press ⏎ to open your search in Jira →',
      arg: `https://${config.get('org')}.atlassian.net/secure/QuickSearch.jspa?searchString=${
        alfred.input
      }`,
    });
  } else if (hasUpdate) {
    // Remove uid to avoid sorting when there is an update
    items = items.concat(issues.map(({ uid, ...item }) => item));
  } else {
    items = items.concat(issues);
  }

  alfred.output(items, { rerun: 5, variables: config.store });
})();
