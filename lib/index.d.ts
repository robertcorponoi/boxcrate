import Options from './Options';
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
    timer: number;
    /**
     * The timestamp of the previous expired item check.
     *
     * @since 2.0.0
     *
     * @property {number}
     */
    previousCheckTime: number;
    /**
     * The timestamp of the current expired item check.
     *
     * @since 2.0.0
     *
     * @property {number}
     */
    currentCheckTime: number;
    /**
     * A reference to the window localStorage object.
     *
     * @since 0.1.0
     *
     * @property {Storage}
     */
    storage: Storage;
    /**
     * The amount of items in storage.
     *
     * @since 0.1.0
     *
     * @property {number}
     */
    count: number;
    /**
     * @param {Object} [options]
     * @param {string} [options.expiredCheckType='passive'] The type of check to use for expired data.
     * @param {number} [options.expiredCheckInterval=60000] If 'active' monitoring is used this can be used to change the check interval.
     */
    constructor(options?: Object);
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
    setItem(id: string, value: any, msToExpire?: number): BoxCrate;
    /**
     * Retrieves an item.
     *
     * @since 0.1.0
     *
     * @param {string} id The id of the item to retrieve from storage.
     *
     * @returns {*} Returns the data associated with the item.
     */
    getItem(id: string): any;
    /**
     * Removes an item.
     *
     * @since 0.1.0
     *
     * @param {string} id The id of the item to remove from storage.
     *
     * @returns {BoxCrate} Returns this for chaining.
     */
    removeItem(id: string): BoxCrate;
    /**
     * Removes all items from storage.
     *
     * @since 0.1.0
     *
     * @returns {BoxCrate} Returns this for chaining.
     */
    clear(): BoxCrate;
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
    private parseItem;
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
    private convertString;
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
    private itemIsExpired;
    /**
     * Checks for expired items in the storage.
     *
     * @since 0.1.0
     *
     * @private
     */
    private checkForExpiredItems;
    /**
     * Set up the active expired data checking if selected.
     *
     * @since 0.1.0
     *
     * @private
     */
    private boot;
}
