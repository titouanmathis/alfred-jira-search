const alfred = require('./get-alfred');
const config = require('./get-config');

module.exports = () => {
  if (!(config.get('org') && config.get('token') && config.get('username'))) {
    alfred.output(
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

    process.exit();
  }
};
