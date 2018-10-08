'use strict'

/**
 * BoxCrate abstracts the use of localStorage and sessionStorage providing
 * an easy to work with interface while maintaining the full functionality
 * of those APIs.
 * 
 * BoxCrate lets you save any type of item without having to worry about parsing
 * or formatting it first.
 */
class BoxCrate {

  /**
   * @param {Object} [options]
   * @param {string} [options.expiredCheckType=null] If an expiration time is provided when setting a value, there are four ways in which BoxCrate can check for expired items:
   * 
   * 1. 'onGet': With the type set to 'onGet', whenever an item is set to be retrieved from localStorage, it is checked to see if
   * it is expired and if so deleted and never retrieved.
   * **Advantage:** Very passive type of check, minimal performance cost.
   * **Disadvantage:** The item could be expired for a long time and still be accessible directly in the localStorage through the
   * browser if the user checks it themselves.
   * 
   * 2. 'passive': Every 60 seconds the localStorage will be checked for expired values and if found, they will be removed.
   * **Advantage:** Passive type of check, expired values are removed quickly.
   * **Disadvantage:** Performance cost is higher because of a timer having to be run.
   * 
   * 3. 'active': Every second the localStorage will be checked for expired values and if found, they will be removed.
   * **Advantage:** Very active type of check, expired values are removed almost instantly.
   * **Disadvantage:** Performance cost is highest.
   * 
   * 4. 'custom': The localStorage wil be checked every X milliseconds, as specified by you. If this option is chosen, make sure to
   * also specify the `expireCheckTime` option.
   * 
   * @param {number} [options.expiredCheckInterval=0] If a custom expired check timer is chosen, specify the interval in milliseconds here.
   */
  constructor(options = {}) {

    /**
     * Create an options object by merging the user selected options
     * with the defaults.
     * 
     * @property {Object}
     * @readonly
     */
    this._options = Object.assign({

      /**
       * The type of expired value check to perform.
       * 
       * Choices are: 'onGet', 'passive', 'active', or 'custom'.
       * 
       * @property {string}
       * @default null
       */
      expiredCheckType: null,

      /**
       * If the custom expired item check type is selected, this is the interval.
       * 
       * @property {number}
       * @default 0
       */
      expiredCheckInterval: 1000

    }, options);

    /**
     * The id of the `setTimeout` timer used to check for expired items.
     * 
     * @property {number}
     * @readonly
     */
    this.id = null;

    /**
     * The timestamp of the last expired item check.
     * 
     * @property {number}
     * @readonly
     */
    this.prev = 0;

    /**
     * The timestamp of the current expired item check.
     * 
     * @property {DOMHighResTimestamp}
     * @readonly
     */
    this.time = 0;

    /**
     * The method to use for checking for expired items.
     * 
     * @property {string}
     * @readonly
     */
    this.expiredCheckType = this._options.expiredCheckType;

    /**
     * The custom interval for checking for expired items.
     * 
     * @property {number}
     * @readonly
     */
    this.expiredCheckInterval = null;

    /**
     * A reference to the localStorage Storage object.
     * 
     * @property {window.localStorage}
     * @readonly
     */
    this.storage = window.localStorage;

    /**
     * The number of data items stored in the BoxCrate storage.
     * 
     * @property {number}
     * @readonly
     */
    this.length = 0;

    /**
     * Initialize the check loop for expired items if desired.
     */
    this._boot();

  }

  /**
   * If the passive, active, or custom item expiry check process is chosen, set up the
   * correct timer and start it to continuously check for expired items.
   * 
   * @since 0.1.0
   */
  _boot() {

    if (!this.expiredCheckType) return;

    switch (this.expiredCheckType) {

      case 'passive':
        this.expiredCheckInterval = 60000;
        break;

      case 'active':
        this.expiredCheckInterval = 1000;
        break;

      case 'custom':
        this.expiredCheckInterval = this._options.expiredCheckInterval;
        break;

    }

    if (this.expiredCheckType && this.expiredCheckType !== 'onGet') this.id = window.setTimeout(() => { this._checkExpiredInterval() }, this.expiredCheckInterval);

  }

  /**
   * Save an item to the BoxCrate storage.
   * 
   * @since 0.1.0
   * 
   * @param {string} key The key to use for the saved item. This will be used when retrieving or modifying it.
   * @param {*} value The item to save.
   * @param {number} [msToExpire] The time, in milliseconds, until this key value pair expire and are removed.
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  setItem(key, value, msToExpire) {

    let item = {
      type: null,
      timestamp: null,
      expires: null,
      data: null,
    };

    switch (typeof value) {

      case 'string':
      case 'number':
      case 'boolean':
        item.type = typeof value;
        item.data = value.toString();
        break;

      case 'undefined':
        item.type = 'undefined';
        item.data = undefined;
        break;

      case 'object':
        if (Array.isArray(value)) {

          let _value = [];

          for (let val of value) {

            if (typeof (val) === 'object' && val !== null) val = JSON.stringify(val);

            _value.push(val);

          }

          item.type = 'array';
          item.data = _value.join('|');

        }
        else if (value === null) {

          item.type = 'null';
          item.data = 'null';

        }
        else if (value.size !== null && value.size !== undefined && value.size > 0) {

          item.type = 'set';
          item.data = [...value].join();

        }
        else {

          item.type = 'object';
          item.data = JSON.stringify(value);

        }
        break;

    }

    item.timestamp = window.performance.now();

    item.expires = msToExpire;

    this.storage.setItem(key, JSON.stringify(item));

    this.length++;

    return this;

  }

  /**
   * Retrieve a saved item from the BoxCrate storage.
   * 
   * @since 0.1.0
   * 
   * @param {string} key The key that was used when the item was saved.
   * 
   * @returns {*} The value associated with the key as it was saved.
   */
  getItem(key) {

    if (this.storage.length === 0) return;

    let item = this.storage.getItem(key);

    item = JSON.parse(item);

    if (this.expiredCheckType === 'onGet') if (this._removeExpired(key, item)) return;

    return this._parse(item.data, item.type);

  }

  /**
   * Remove an items from the BoxCrate storage.
   * 
   * @since 0.1.0
   * 
   * @param {string} key The key of the item to remove.
   */
  removeItem(key) {

    this.storage.removeItem(key);

    this.length--;

  }

  /**
   * Remove all items from the BoxCrate storage.
   * 
   * @since 0.1.0
   */
  clear() {

    this.storage.clear();

    this.length = 0;

  }

  /**
   * Parse takes a value and a string specifying what type of value that the
   * provided value needs to be and then it makes the provided value that type.
   * 
   * @since 0.1.0
   * 
   * @param {*} data The original value.
   * @param {string} expected The type of value that the original value should be.
   * 
   * @returns {*} The parsed value.
   */
  _parse(data, expected) {

    switch (expected) {

      case 'string':
        return String(data);

      case 'number':
        return Number(data);

      case 'boolean':
        return Boolean(data);

      case 'undefined':
        return undefined;

      case 'null':
        return null;

      case 'array':
        let arr = [];
        let _arr = data.split('|');

        for (let value of _arr) {

          arr.push(this._convert(value));

        }

        return arr;

      case 'object':
        return JSON.parse(data);

    }

  }

  /**
   * Convert a value to the best possible primitive type from a string.
   * 
   * @since 0.1.0
   * 
   * @param {string} value The value to convert to another primitive.
   * 
   * @returns {*} The converted value.
   */
  _convert(value) {

    // Check boolean.
    if (value === 'true' || value === 'false') return Boolean(value);

    // Check undefined.
    else if (value === 'undefined') return undefined;

    // Check null.
    else if (value === 'null') return null;

    // Check number.
    else if (Number(value)) return Number(value);

    // Is object or string.
    else {

      try {

        const obj = JSON.parse(value);

        return obj;

      }
      catch (err) {

        return value;

      }

    }

  }

  /**
   * Check for expired items if the expiredCheckType is set to passive, active, or
   * custom.
   * 
   * This method automatically runs on a repeating `setTimeout` timer if one of the
   * above properties was used during initialization.
   * 
   * @since 0.1.0
   */
  _checkExpiredInterval() {

    this.time = window.performance.now();

    if (this.time - this.prev >= this.expiredCheckInterval) {

      for (let key in this.storage) {

        if (this.storage.hasOwnProperty(key)) {

          const item = JSON.parse(this.storage[key]);

          this._removeExpired(key, item);

        }

      }

      this.prev = this.time;

    }

    this.id = window.setTimeout(() => { this._checkExpiredInterval() }, this.expiredCheckInterval);

  }

  /**
   * Compares an items expired time to the current time and remove it from the storage
   * if necessary.
   * 
   * This is used automatically by the interval and the onGet expired item checker.
   * 
   * @param {string} key The key of the item as set in the storage.
   * @param {Object} item The item to check and remove.
   */
  _removeExpired(key, item) {

    if (item.expires !== null) {

      if (window.performance.now() - item.timestamp >= item.expires) {

        this.storage.removeItem(key);

        this.length--;

        return true;

      }

    }

    return false;

  }

}