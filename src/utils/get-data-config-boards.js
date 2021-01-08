const Conf = require('conf');

const config = new Conf({
  configName: 'jira-data-boards',
  schema: {
    updated: {
      type: 'number',
    },
    items: {
      type: 'array',
      default: [],
    },
  },
  serialize: (value) => JSON.stringify(value),
});

module.exports = config;
