const pkg = require('./package.json');
const Alfred = require('./utils/alfred');

const alfred = new Alfred({ name: `${pkg.name}@${pkg.version}` });
const config = require('./utils/get-config.js');

if (process.argv.length <= 2) {
  return alfred.output(
    [
      {
        title: 'Configure your Jira token',
        subtitle: `Generate one on https://id.atlassian.net → "${config.get('token')}"`,
        arg: 'token',
      },
      {
        title: 'Configure your Jira organization name',
        subtitle: `JIRA_ORG in https://JIRA_ORG.atlassian.net → "${config.get('org')}"`,
        arg: 'org',
      },
      {
        title: 'Configure your Jira username',
        subtitle: `The email you use to login → "${config.get('username')}"`,
        arg: 'username',
      },
    ],
    { variables: config.store }
  );
}

const key = process.argv[2].replace('--', '');
const value = process.argv[3];
const save = process.argv[4] === '--save';

if (save) {
  try {
    config.set(key, value);
  } catch (err) {
    alfred.error(err);
  }

  return;
}

const confNames = {
  org: 'organization name',
  token: 'Jira token',
  username: 'Jira username',
};

alfred.output(
  [
    {
      title: `Set "${value}" as your ${confNames[key]}`,
      subtitle: 'Press ↩︎ to validate and save the value.',
      arg: value,
    },
  ],
  { rerun: 0.1 }
);
