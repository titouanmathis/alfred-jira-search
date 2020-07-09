/* eslint-disable class-methods-use-this */
const os = require('os');
const axios = require('axios');
const Cache = require('./cache');

/**
 * Alfred class.
 */
class Alfred {
  /**
   * Class constructor.
   * @param  {String} options.name The name of the package.
   * @return {Alfred}              A new Alfred instance.
   */
  constructor({ name = 'alfred' } = {}) {
    this.name = name;
    this.cache = new Cache({ name, ttl: 1 });
    process.on('uncaughtException', this.error.bind(this));
    return this;
  }

  /**
   * Get Workflow/Alfred meta data.
   * @return {Object}
   */
  get meta() {
    const getEnv = key => process.env[`alfred_${key}`];

    return {
      workflow: {
        name: getEnv('workflow_name'),
        version: getEnv('workflow_version'),
        uid: getEnv('workflow_uid'),
        bundleId: getEnv('workflow_bundleid'),
      },
      alfred: {
        version: getEnv('version'),
        theme: getEnv('theme'),
        themeBackground: getEnv('theme_background'),
        themeSelectionBackground: getEnv('theme_selection_background'),
        themeSubtext: Number(getEnv('theme_subtext')),
        data: getEnv('workflow_data'),
        cache: getEnv('workflow_cache'),
        preferences: getEnv('preferences'),
        preferencesLocalHash: getEnv('preferences_localhash'),
      },
    };
  }

  /**
   * Get systems icons.
   * @return {Object}
   */
  get icons() {
    const getIcon = name =>
      `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/${name}.icns`;

    return {
      get: getIcon,
      info: getIcon('ToolbarInfo'),
      warning: getIcon('AlertCautionIcon'),
      error: getIcon('AlertStopIcon'),
      alert: getIcon('Actions'),
      like: getIcon('ToolbarFavoritesIcon'),
      delete: getIcon('ToolbarDeleteIcon'),
    };
  }

  /**
   * Get the scripts input.
   * @return {String}
   */
  get input() {
    return process.argv[2] || '';
    // return removeDiacritics(process.argv[2] || '');
  }

  /**
   * Output data.
   *
   * @param  {Object|Array} data The data to output.
   * @return {void}
   */
  output(items) {
    console.log(JSON.stringify({ items }, null, '\t'));
  }

  /**
   * Fetch data with axios
   * @param  {String}  url     The URL to fetch.
   * @param  {Object}  options Options for the request.
   * @return {Promise}        The fetch promise.
   */
  async fetch(url, options) {
    let key = `${url}-${JSON.stringify(options)}`;
    key = key.replace(/\s/g, '');

    if (this.cache.get(key)) {
      return this.cache.get(key);
    }

    try {
      const response = await axios(url, options);
      this.cache.set(key, response.data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Output an error message.
   * @param  {Erro} error The catched error.
   */
  error(error) {
    const stack = error.stack || error;
    const copy = `
\`\`\`
${stack}
\`\`\`
-
${this.meta.workflow.name} ${this.meta.workflow.version}
Alfred ${this.meta.alfred.version}
${process.platform} ${os.release()}
    `.trim();

    this.output([
      {
        title: error.stack ? `${error.name}: ${error.message}` : error,
        subtitle: 'Press ⌘L to see the full error and ⌘C to copy it.',
        valid: false,
        text: {
          copy,
          largetype: stack,
        },
        icon: {
          path: this.icons.error,
        },
      },
    ]);
  }
}

module.exports = Alfred;
