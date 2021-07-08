const latestVersion = require('latest-version');
const semver = require('semver');
const pkg = require('../package.json');
const config = require('./get-config');

(async () => {
  console.log('Checking if there is a new version available...');
  const version = await latestVersion(pkg.name);
  const hasNewVersion = semver.gt(version, pkg.version);

  if (hasNewVersion) {
    console.log('There is a new version available:', pkg.version, '→', version);
  } else {
    console.log('The package is up to date.');
  }

  config.set('shouldUpdate', hasNewVersion);
  config.set('latestVersion', version);
  config.set('latestUpdateCheck', new Date().toLocaleString());
})();
