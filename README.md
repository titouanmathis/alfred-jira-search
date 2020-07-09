# Alfred Jira Search

[![NPM Version](https://img.shields.io/npm/v/alfred-jira-search.svg?style=flat-square)](https://www.npmjs.com/package/alfred-jira-search)
[![Dependency Status](https://img.shields.io/david/alfred-jira-search.svg?label=deps&style=flat-square)](https://david-dm.org/alfred-jira-search)
[![devDependency Status](https://img.shields.io/david/dev/alfred-jira-search.svg?label=devDeps&style=flat-square)](https://david-dm.org/alfred-jira-search?type=dev)

> Alfred workflow to quickly search through your Jira issues 🔎

## Installation

This workflow works on top of alfy, you can install it with NPM:

```bash
npm install -g alfred-jira-search
```

Or you can download the worflow from the [releases page](https://github.com/titouanmathis/alfred-jira-search/releases).

## Configuration

You need to set up the following variables for the workflow to work:

- `JIRA_ORG`: the name of your Jira organization (https://{JIRA_ORG}.atlassian.net)
- `JIRA_USERNAME`: your username used to connect to Jira
- `JIRA_TOKEN`: a Jira API token

> You can create an API token by logging in to [https://id.atlassian.com/manage/api-tokens](https://id.atlassian.com/manage/api-tokens).

## Usage

Type `jira` with or without a query and a list of Jira issues will be displayed. You can then press return to open the issue page.

### `jira`

Lists the 10 most recents issues that are assigned to you and unresolved. The following JQL query is used:

```
assignee = currentUser()
AND resolution = Unresolved
ORDER BY updated DESC
```

### `jira <issueKey>`

Find issues by their key. The following JQL query is used:

```
issue = '<issueKey>'
OR issue = '<issueKey>0'
OR issue = '<issueKey>1'
OR issue = '<issueKey>2'
OR issue = '<issueKey>3'
OR issue = '<issueKey>4'
OR issue = '<issueKey>5'
OR issue = '<issueKey>6'
OR issue = '<issueKey>7'
OR issue = '<issueKey>8'
OR issue = '<issueKey>9'
ORDER BY updated DESC
```

If you search for `JIRA-10`, all issues between `JIRA-100` and `JIRA-109` will match too.

### `jira p <projectKey>[ <text>]`

List all issues in the given project, and filter them with the `<text>` search query. The following JQL query is used:

```
[text ~ '<text>' AND ]project = '<projectKey>' ORDER BY updated DESC
```

### `jira <text>`

For all queries not matching the Regex of a Jira issue key, a simple text query will be used:

```
text ~ '<text>' ORDER BY updated DESC
```

### `jira u <user>` (todo)

Search for users, list all issues assigned to the given user by updated date on activation.

### `jira v <version>` (todo)

Search for versions, list all issues in the version on activation.

### `jira b <board>` (todo)

Search for boards, list all issues in the board on activation.
