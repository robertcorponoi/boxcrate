'use strict'

/**
 * Defines the options available and their defaults for BoxCrate.
 */
export default class Options {

  /**
   * The type of expired data checking to use.
   * 
   * The available options are 'passive' and 'active'.
   * 
   * Passive will check to see if the data is expired at the time it is querying that data. This is very performant and perfect if you're not
   * using another application to query the localStorage.
   * 
   * Active will check for expired data on an interval. By default the interval is 60000ms but this can be changed.
   * 
   * @property {string}
   * 
   * @default 'passive'
   */
  expiredCheckType: string = 'passive';

  /**
   * If the 'active' expired check type is used this can be used to adjust the check interval.
   * 
   * @property {number}
   * 
   * @default 60000
   */
  expiredCheckInterval: number = 60000;

  /**
   * @param {Object} [options={}] The initialization parameters from BoxCrate.
   */
  constructor(options: Object = {}) {

    Object.assign(this, options);

  }

}