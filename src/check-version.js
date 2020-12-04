const latestVersion = require('latest-version');
const semver = require('semver');
const pkg = require('./package.json');
const config = require('./utils/get-config');

(async () => {
  const version = await latestVersion(pkg.name);
  const hasNewVersion = semver.gt(version, pkg.version);

  config.set('shouldUpdate', hasNewVersion);
  config.set('latestVersion', version);
})();
