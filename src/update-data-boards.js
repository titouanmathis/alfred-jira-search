const RunQueue = require('run-queue');
const axios = require('axios');
const config = require('./utils/get-config');
const data = require('./utils/get-data-config-boards');
const formatBoards = require('./utils/format-boards');

const queue = new RunQueue({
  maxConcurrency: 20,
});

const MAX_RESULTS = 50;

const MAX_AGE = 1000 * 60 * 5; // 1000ms * 60s * 5min = 5min

const instance = axios.create({
  baseURL: `https://${config.get('org')}.atlassian.net/rest/agile/1.0/board/`,
  auth: {
    username: config.get('username'),
    password: config.get('token'),
  },
  method: 'get',
});

const boards = [];

/**
 * Save data at the end.
 */
function end() {
  console.log(`Saving results in ${data.path}...`);
  data.set({
    items: boards.flat(),
    updated: Date.now(),
  });
  console.log('All done!');
}

/**
 * Get a page result.
 * @param {Object} { offset, total }
 */
function getPageResult(offset) {
  return async () => {
    console.log(`Getting page result from ${offset} to ${offset + MAX_RESULTS}...`);
    return new Promise((resolve, reject) => {
      instance
        .request({
          params: {
            startAt: offset,
            maxResults: MAX_RESULTS,
          },
        })
        .then((response) => {
          console.log(`Got results from ${offset} to ${offset + MAX_RESULTS}!`);
          boards.push(formatBoards(config, response.data.values));
          resolve(response.data);
        })
        .catch(reject);
    });
  };
}

const firstBatch = getPageResult(0);

console.time('Update data');
const lastUpdated = data.get('updated');
const force = process.argv[2] === '--force';

if (!force && lastUpdated && Date.now() - lastUpdated < MAX_AGE) {
  console.log('Data in cache still valid.');
  console.timeEnd('Update data');
  return;
}

firstBatch().then((result) => {
  let offset = MAX_RESULTS;

  while (offset <= result.total) {
    queue.add(0, getPageResult(offset));
    offset += MAX_RESULTS;
  }

  queue.run().then(() => {
    end();
    console.timeEnd('Update data');
  });
});
