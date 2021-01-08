const formatBoardUrl = (org, id) =>
  `https://${org}.atlassian.net/secure/RapidBoard.jspa?rapidView=${id}`;

module.exports = (config, boards) =>
  boards.map(({ id, name, location }) => ({
    uid: id,
    title: `${name}`,
    subtitle: `${location.displayName}`,
    arg: formatBoardUrl(config.get('org'), id),
    quicklookurl: formatBoardUrl(config.get('org'), id),
    text: {
      copy: formatBoardUrl(config.get('org'), id),
    },
    mods: {
      cmd: {
        subtitle: 'Copy the board URL with ⌘+C',
      },
    },
    get match() {
      return `p=${location.projectKey} ${location.projectKey} ${name}`;
    },
  }));
