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
    private _options;
    /**
     * The id of the setTimeout timer.
     *
     * @private
     *
     * @property {number}
     */
    private _timer;
    /**
     * The timestamp of the previous expired item check.
     *
     * @property {number}
     */
    private _previousCheckTime;
    /**
     * The timestamp of the current expired item check.
     *
     * @property {number}
     */
    private _currentCheckTime;
    /**
     * A reference to the window localStorage object.
     *
     * @property {Storage}
     */
    private _storage;
    /**
     * The amount of items in storage.
     *
     * @property {number}
     */
    private _count;
    /**
     * @param {Object} [options]
     * @param {string} [options.expiredCheckType='passive'] The type of check to use for expired data.
     * @param {number} [options.expiredCheckInterval=60000] If 'active' monitoring is used this can be used to change the check interval.
     */
    constructor(options?: Object);
    /**
     * Returns the storage oboject.
     *
     * @returns {Storage}
     */
    get storage(): Storage;
    /**
     * Returns the amount of items in storage.
     *
     * @returns {number}
     */
    get count(): number;
    /**
     * Saves an item.
     *
     * @param {string} id The unique id of this item used to modify or retrieve it.
     * @param {*} value The data to save.
     * @param {number} [msToExpire=Infinity] The amount of time, in milliseconds, until this item is considered expired.
     *
     * @returns {BoxCrate} Returns this for chaining.
     */
    setItem(id: string, value: any, msToExpire?: number): BoxCrate;
    /**
     * Retrieves an item.
     *
     * @param {string} id The id of the item to retrieve from storage.
     *
     * @returns {*} Returns the data associated with the item.
     */
    getItem(id: string): any;
    /**
     * Removes an item.
     *
     * @param {string} id The id of the item to remove from storage.
     *
     * @returns {BoxCrate} Returns this for chaining.
     */
    removeItem(id: string): BoxCrate;
    /**
     * Removes all items from storage.
     *
     * @returns {BoxCrate} Returns this for chaining.
     */
    clear(): BoxCrate;
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
    private _parseItem;
    /**
     * Attempts to convert a string value into another primitive or complex type.
     *
     * @private
     *
     * @param {string} value The value to attempt to convert.
     *
     * @returns {*} Returns the converted value.
     */
    private _convertString;
    /**
     * Returns whether or not an item is expired.
     *
     * @private
     *
     * @param {Item} item The item to check if expired.
     *
     * @returns {boolean} Returns true if the item is expired or false otherwise.
     */
    private _itemIsExpired;
    /**
     * Checks for expired items in the storage.
     *
     * @private
     */
    private _checkForExpiredItems;
    /**
     * Set up the active expired data checking if selected.
     *
     * @private
     */
    private _boot;
}
