const path = require('path');
const pkg = require('../package.json');
const config = require('./get-config');
const runBackground = require('./run-background');

const testUpdate = () => {
  runBackground(path.resolve(__dirname, 'check-version.js'));
  return config.get('shouldUpdate') && pkg.version !== config.get('latestVersion');
};

const getUpdateItem = () => ({
  title: `A new version is available: ${pkg.version} → ${config.get('latestVersion')}`,
  subtitle: 'Press ⏎ to install it automatically or ⌘+⏎ to open the releases page',
  arg: 'update',
  mods: {
    cmd: {
      subtitle: 'Press ⏎ to open the workflow releases page',
      arg: 'https://github.com/titouanmathis/alfred-jira-search/releases',
    },
  },
});

module.exports = {
  testUpdate,
  getUpdateItem,
};
