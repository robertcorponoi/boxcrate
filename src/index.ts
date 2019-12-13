'use strict'

import Options from './Options';

import Item from './interfaces/Item';

/**
 * BoxCrate abstracts the use of localStorage providing an easy to work with interface while maintaining the full functionality 
 * of the original APIs.
 * 
 * BoxCrate works with data as it is without you having to worry about stringifying it to save it.
 */
export default class BoxCrate {

  /**
   * A reference to the options for this instance of BoxCrate.
   * 
   * @private
   * 
   * @property {Options}
   */
  private _options: Options;

  /**
   * The id of the setTimeout timer.
   * 
   * @private
   * 
   * @property {number}
   */
  private _timer: number = 0;

  /**
   * The timestamp of the previous expired item check.
   * 
   * @property {number}
   */
  private _previousCheckTime: number = 0;

  /**
   * The timestamp of the current expired item check.
   * 
   * @property {number}
   */
  private _currentCheckTime: number = 0;

  /**
   * A reference to the window localStorage object.
   * 
   * @property {Storage}
   */
  private _storage: Storage = window.localStorage;

  /**
   * The amount of items in storage.
   * 
   * @property {number}
   */
  private _count: number = 0;

  /**
   * @param {Object} [options]
   * @param {string} [options.expiredCheckType='passive'] The type of check to use for expired data.
   * @param {number} [options.expiredCheckInterval=60000] If 'active' monitoring is used this can be used to change the check interval.
   */
  constructor(options?: Object) {

    this._options = new Options(options);

    this._boot();

  }

  /**
   * Returns the storage oboject.
   * 
   * @returns {Storage}
   */
  get storage(): Storage { return this._storage; }

  /**
   * Returns the amount of items in storage.
   * 
   * @returns {number}
   */
  get count(): number { return this._count; }

  /**
   * Saves an item.
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

    this._storage.setItem(id, JSON.stringify(item));

    this._count++;

    return this;

  }

  /**
   * Retrieves an item.
   * 
   * @param {string} id The id of the item to retrieve from storage.
   * 
   * @returns {*} Returns the data associated with the item.
   */
  getItem(id: string): any {

    if (this._storage.length === 0) return;

    const item: Item = JSON.parse(this._storage.getItem(id)!);

    if (this._options.expiredCheckType === 'passive' && item.expires) {

      if (this._itemIsExpired(item)) {

        this.removeItem(id);

        return;

      }

    }

    return this._parseItem(item.type, item.data);

  }

  /**
   * Removes an item.
   * 
   * @param {string} id The id of the item to remove from storage.
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  removeItem(id: string): BoxCrate {

    this._storage.removeItem(id);

    this._count--;

    return this;

  }

  /**
   * Removes all items from storage.
   * 
   * @returns {BoxCrate} Returns this for chaining.
   */
  clear(): BoxCrate {

    this._storage.clear();

    this._count = 0;

    return this;

  }

  /**
   * Parse an item's data and return it in its original form.
   * 
   * @private
   * 
   * @param {string} type The type of data that the data is.
   * @param {*} data The data to parse.
   * 
   * @returns {*} Returns the parsed data value.
   */
  private _parseItem(type: string, data: any): any {

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

        for (const item of saved) original.push(this._convertString(item));

        return original;

      case 'boolean':
      case 'object':
        return JSON.parse(data);
    }

  }

  /**
   * Attempts to convert a string value into another primitive or complex type.
   * 
   * @private
   * 
   * @param {string} value The value to attempt to convert.
   * 
   * @returns {*} Returns the converted value.
   */
  private _convertString(value: string): any {

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
   * @private
   * 
   * @param {Item} item The item to check if expired.
   * 
   * @returns {boolean} Returns true if the item is expired or false otherwise.
   */
  private _itemIsExpired(item: Item): boolean {

    if (window.performance.now() - item.timestamp >= item.expires) return true;

    return false;

  }

  /**
   * Checks for expired items in the storage.
   * 
   * @private
   */
  private _checkForExpiredItems() {

    this._currentCheckTime = window.performance.now();

    if (this._currentCheckTime - this._previousCheckTime >= this._options.expiredCheckInterval) {

      for (const key in this._storage) {

        if (this._storage.hasOwnProperty(key) && this._itemIsExpired(JSON.parse(this._storage[key]))) this.removeItem(key);

      }

      this._previousCheckTime = this._currentCheckTime;

    }

    this._timer = window.setTimeout(() => {

      this._checkForExpiredItems();

    }, this._options.expiredCheckInterval);

  }

  /**
   * Set up the active expired data checking if selected.
   * 
   * @private
   */
  private _boot() {

    if (this._options.expiredCheckType === 'active') {

      this._timer = window.setTimeout(() => {
        this._checkForExpiredItems();
      }, this._options.expiredCheckInterval);

    }

  }

}