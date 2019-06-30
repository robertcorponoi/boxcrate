'use strict'

import Options from './Options';

import Item from './interfaces/Item';

/**
 * BoxCrate abstracts the use of localStorage providing an easy to work with interface while maintaining the full functionality 
 * of the original APIs.
 * 
 * BoxCrate works with data as it is without you having to worry about stringifying it to save it.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 * 
 * @version 2.0.0
 */
export default class BoxCrate {

  /**
   * A reference to the options for this instance of BoxCrate.
   * 
   * @since 2.0.0
   * 
   * @property {Options}
   */
  options: Options;

  /**
   * The id of the setTimeout timer.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */
  timer: number = 0;

  /**
   * The timestamp of the previous expired item check.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */
  previousCheckTime: number = 0;

  /**
   * The timestamp of the current expired item check.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */
  currentCheckTime: number = 0;

  /**
   * A reference to the window localStorage object.
   * 
   * @since 0.1.0
   * 
   * @property {Storage}
   */
  storage: Storage = window.localStorage;

  /**
   * The amount of items in storage.
   * 
   * @since 0.1.0
   * 
   * @property {number}
   */
  count: number = 0;

  /**
   * @param {Object} [options]
   * @param {string} [options.expiredCheckType='passive'] The type of check to use for expired data.
   * @param {number} [options.expiredCheckInterval=60000] If 'active' monitoring is used this can be used to change the check interval.
   */
  constructor(options?: Object) {

    this.options = new Options(options);

    this.boot();

  }

  /**
   * Saves an item.
   * 
   * @since 0.1.0
   * 
   * @param {string} id The unique id of this item used to modify or retrieve it.
   * @param {*} value The data to save.
   * @param {number} [msToExpire=Infinity] The amount of time, in milliseconds, until this item is considered expired.
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  setItem(id: string, value: any, msToExpire: number = Infinity): BoxCrate {

    const item: Item = { type: '', timestamp: 0, expires: Infinity, data: null };

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

          const _value = [];

          for (let val of value) {
            
            if (typeof (val) === 'object' && val !== null) val = JSON.stringify(val);

            _value.push(val);

          }

          item.type = 'array';
          item.data = _value.join('|');

        }
        else if (!value) {
          item.type = 'null';
          item.data = null;
        }
        else if (value.size) {
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

    this.storage.setItem(id, JSON.stringify(item));

    this.count++;

    return this;

  }

  /**
   * Retrieves an item.
   * 
   * @since 0.1.0
   * 
   * @param {string} id The id of the item to retrieve from storage.
   * 
   * @returns {*} Returns the data associated with the item.
   */
  getItem(id: string): any {

    if (this.storage.length === 0) return;

    const item: Item = JSON.parse(this.storage.getItem(id)!);

    if (this.options.expiredCheckType === 'passive' && item.expires) {

      if (this.itemIsExpired(item)) {

        this.removeItem(id);

        return;

      }

    }

    return this.parseItem(item.type, item.data);

  }

  /**
   * Removes an item.
   * 
   * @since 0.1.0
   * 
   * @param {string} id The id of the item to remove from storage.
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  removeItem(id: string): BoxCrate {

    this.storage.removeItem(id);

    this.count--;

    return this;

  }

  /**
   * Removes all items from storage.
   * 
   * @since 0.1.0
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  clear(): BoxCrate {

    this.storage.clear();

    this.count = 0;

    return this;

  }

  /**
   * Parse an item's data and return it in its original form.
   * 
   * @since 2.0.0
   * 
   * @private
   * 
   * @param {string} type The type of data that the data is.
   * @param {*} data The data to parse.
   * 
   * @returns {*} Returns the parsed data value.
   */
  private parseItem(type: string, data: any): any {

    switch (type) {
      case 'string':
        return data.toString();

      case 'number':
        return Number(data);

      case 'undefined':
        return undefined;

      case 'null':
        return null;

      case 'array':
        const original: Array<any> = [];
        const saved: Array<any> = data.split('|');

        for (const item of saved) original.push(this.convertString(item));

        return original;

      case 'boolean':
      case 'object':
        return JSON.parse(data);
    }

  }

  /**
   * Attempts to convert a string value into another primitive or complex type.
   * 
   * @since 2.0.0
   * 
   * @private
   * 
   * @param {string} value The value to attempt to convert.
   * 
   * @returns {*} Returns the converted value.
   */
  private convertString(value: string): any {

    switch (value) {
      case 'true':
      case 'false':
        return Boolean(value);

      case 'undefined':
        return undefined;

      case 'null':
        return null;

      default:
        if (Number(value)) return Number(value);

        else {
          try {
            return JSON.parse(value);
          } catch (err) {
            return value;
          }
        }
    }

  }

  /**
   * Returns whether or not an item is expired.
   * 
   * @since 2.0.0
   * 
   * @private
   * 
   * @param {Item} item The item to check if expired.
   * 
   * @returns {boolean} Returns true if the item is expired or false otherwise.
   */
  private itemIsExpired(item: Item): boolean {

    if (window.performance.now() - item.timestamp >= item.expires) return true;

    return false;

  }

  /**
   * Checks for expired items in the storage.
   * 
   * @since 0.1.0
   * 
   * @private
   */
  private checkForExpiredItems() {

    this.currentCheckTime = window.performance.now();

    if (this.currentCheckTime - this.previousCheckTime >= this.options.expiredCheckInterval) {

      for (const key in this.storage) {

        if (this.storage.hasOwnProperty(key) && this.itemIsExpired(JSON.parse(this.storage[key]))) this.removeItem(key);

      }

      this.previousCheckTime = this.currentCheckTime;

    }

    this.timer = window.setTimeout(() => {

      this.checkForExpiredItems();

    }, this.options.expiredCheckInterval);

  }

  /**
   * Set up the active expired data checking if selected.
   * 
   * @since 0.1.0
   * 
   * @private
   */
  private boot() {

    if (this.options.expiredCheckType === 'active') {

      this.timer = window.setTimeout(() => {

        this.checkForExpiredItems();


      }, this.options.expiredCheckInterval);

    }

  }

}