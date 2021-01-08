const childProcess = require('child_process');
const path = require('path');

const defaultCmd = path.resolve(__dirname, '../node_modules/.bin/run-node');

/**
 * Run Node with the given args as a background process.
 * @return {ChildProcess}
 */
module.exports = (args, cmd = defaultCmd) => {
  const child = childProcess.spawn(cmd, args.split(' '), {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return child;
};
