const pkg = require('../package.json');
const Alfred = require('./alfred');

const alfred = new Alfred({ name: `${pkg.name}@${pkg.version}` });

module.exports = alfred;
