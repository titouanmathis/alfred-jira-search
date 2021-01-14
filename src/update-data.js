const RunQueue = require('run-queue');
const axios = require('axios');
const config = require('./utils/get-config');
const data = require('./utils/get-data-config');
const formatIssues = require('./utils/format-issues');

const queue = new RunQueue({
  maxConcurrency: 20,
});

const fields = [
  'key',
  'assignee',
  'summary',
  'project',
  'issuetype',
  'status',
  'timespent',
  'timeestimate',
  'updated',
  'customfield_10006',
  'io.tempo.jira__account',
].join(',');

const MAX_RESULTS = 100;

const MAX_AGE = 1000 * 60 * 5; // 1000ms * 60s * 5min = 5min

const instance = axios.create({
  baseURL: `https://${config.get('org')}.atlassian.net/rest/api/3/search/`,
  auth: {
    username: config.get('username'),
    password: config.get('token'),
  },
  method: 'get',
});

const issues = [];

/**
 * Save data at the end.
 */
function end() {
  console.log(`Saving results in ${data.path}...`);
  data.set({
    items: issues.flat(),
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
            fields,
            jql: process.env.CACHE_QUERY,
          },
        })
        .then((response) => {
          console.log(`Got results from ${offset} to ${offset + MAX_RESULTS}!`);
          issues.push(formatIssues(config, response.data.issues));
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
