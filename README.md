# Alfred Jira Search

[![NPM Version](https://img.shields.io/npm/v/alfred-jira-search.svg?style=flat-square)](https://www.npmjs.com/package/alfred-jira-search)
[![Dependency Status](https://img.shields.io/david/titouanmathis/alfred-jira-search?style=flat-square)](https://david-dm.org/titouanmathis/alfred-jira-search)
[![devDependency Status](https://img.shields.io/david/dev/titouanmathis/alfred-jira-search?style=flat-square)](https://david-dm.org/titouanmathis/alfred-jira-search?type=dev)

> Alfred workflow to quickly search through your Jira issues 🔎

## Installation

Download the latest worflow from the [releases page](https://github.com/titouanmathis/alfred-jira-search/releases). You will be notified of future updates within Alfred.

## Configuration

You will be asked to configure the workflow with the following values :

- The name of your Jira organization (`JIRA_ORG` in `https://JIRA_ORG.atlassian.net`)
- Your Jira username which usually is your email
- A Jira API token (create one at [https://id.atlassian.com/manage/api-tokens](https://id.atlassian.com/manage/api-tokens)).

## Usage

| Command | Action |
|-|-|
| `jj` | Display a list of unresolved issues sorted by their last updated date. The list is filtered by Alfred. |
| `ju` | Force update the local data |
| `jconf` | Edit the workflow configuration |

When using the `jj` command, some smart filtering can be done:

```bash
# Filter by project
jj p=<PROJECT_KEY>

# Filter by assignee
jj u=<USERNAME>

# Filter by status
jj s=<STATUS>

# Filter by sprint status
jj sp=<SPRINT_STATUS>
```
