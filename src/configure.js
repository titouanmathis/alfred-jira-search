require('dotenv').config();
const pkg = require('./package.json');
const Alfred = require('./utils/alfred');

const alfred = new Alfred({ name: `${pkg.name}@${pkg.version}` });
const config = require('./utils/get-config.js');

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
