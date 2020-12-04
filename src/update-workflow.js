const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getRelease } = require('get-release');
const gh = require('parse-github-url');
const pkg = require('./package.json');
const runBackground = require('./utils/run-background');

console.log('Update workflow');

/**
 * Download a given url into the given target filepath.
 * @param {String} url
 * @param {String} target
 */
async function download(url, target) {
  const writer = fs.createWriteStream(target);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

(async () => {
  const { owner, name } = gh(pkg.homepage);
  const [url] = await getRelease({
    provider: 'github',
    user: owner,
    repo: name,
  });
  const filename = path.basename(url);
  const filepath = path.join(os.tmpdir(), filename);
  console.log(`Downloading ${url} to ${filepath}...`);
  await download(url, filepath);
  console.log(`Downloaded the new version!`);
  console.log('Updating the workflow...');
  runBackground(filepath, 'open');
})();
