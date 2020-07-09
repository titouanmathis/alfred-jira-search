const { resolve } = require('path');
const flatCache = require('flat-cache');

const DEFAULT_CACHE_PATH = resolve(process.cwd(), '.cache');

/**
 * Cache Class
 */
class Cache {
  /**
   * Class constructor.
   * @param  {String} options.name The name of the cache.
   * @param  {String} options.path The absolute path to a cache folder
   * @param  {Number} options.ttl  The time to live of any cache item.
   * @return {Cache}               A new Cache instance.
   */
  constructor({ name, path = DEFAULT_CACHE_PATH, ttl = 0 }) {
    this.name = name;
    this.path = path;
    this.cache = flatCache.load(name, path);
    this.expire = ttl === 0 ? false : ttl * 1000 * 60;
  }

  /**
   * Get an item by key.
   * @param  {String} key The key of the item.
   * @return {*}          The saved item or undefined if its TTL has expired.
   */
  get(key) {
    const now = new Date().getTime();
    const value = this.cache.getKey(key);
    if (value === undefined || (value.expire !== false && value.expire < now)) {
      return undefined;
    }

    return value.data;
  }

  /**
   * Set an item.
   * @param {String} key   The key of the item.
   * @param {*}      value The value of the item.
   */
  set(key, value) {
    const now = new Date().getTime();
    this.cache.setKey(key, {
      expire: this.expire === false ? false : now + this.expire,
      data: value,
    });
    this.cache.save(true);
  }

  /**
   * Remove an item by its key.
   * @param  {String} key The key of the item.
   */
  remove(key) {
    this.cache.removeKey(key);
  }

  /**
   * Clear the cache.
   */
  clear() {
    flatCache.clearCacheById(this.name, this.path);
  }
}

module.exports = Cache;
