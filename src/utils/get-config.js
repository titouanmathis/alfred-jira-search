const Conf = require('conf');

const config = new Conf({
  configName: 'user-config',
  schema: {
    org: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    shouldUpdate: {
      type: 'boolean',
    },
    latestVersion: {
      type: 'string',
    },
    latestUpdateCheck: {
      type: 'string',
    }
  },
});

module.exports = config;
