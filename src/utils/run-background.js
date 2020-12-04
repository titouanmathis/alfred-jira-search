const childProcess = require('child_process');

/**
 * Run Node with the given args as a background process.
 * @return {ChildProcess}
 */
module.exports = (args, cmd = './node_modules/.bin/run-node') => {
  const child = childProcess.spawn(cmd, args.split(' '), {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return child;
};
