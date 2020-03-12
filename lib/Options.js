'use strict';
/**
 * Defines the options available and their defaults for BoxCrate.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Options =
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

/**
 * If the 'active' expired check type is used this can be used to adjust the check interval.
 * 
 * @property {number}
 * 
 * @default 60000
 */

/**
 * @param {Object} [options={}] The initialization parameters from BoxCrate.
 */
function Options() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Options);

  _defineProperty(this, "expiredCheckType", 'passive');

  _defineProperty(this, "expiredCheckInterval", 60000);

  Object.assign(this, options);
};

exports["default"] = Options;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PcHRpb25zLnRzIl0sIm5hbWVzIjpbIk9wdGlvbnMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBOzs7Ozs7Ozs7Ozs7O0lBR3FCQSxPO0FBQ25COzs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7O0FBU0E7OztBQUdBLG1CQUFrQztBQUFBLE1BQXRCQyxPQUFzQix1RUFBSixFQUFJOztBQUFBOztBQUFBLDRDQWRQLFNBY087O0FBQUEsZ0RBTEgsS0FLRzs7QUFDaENDLEVBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsRUFBb0JGLE9BQXBCO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuLyoqXHJcbiAqIERlZmluZXMgdGhlIG9wdGlvbnMgYXZhaWxhYmxlIGFuZCB0aGVpciBkZWZhdWx0cyBmb3IgQm94Q3JhdGUuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb25zIHtcclxuICAvKipcclxuICAgKiBUaGUgdHlwZSBvZiBleHBpcmVkIGRhdGEgY2hlY2tpbmcgdG8gdXNlLlxyXG4gICAqIFxyXG4gICAqIFRoZSBhdmFpbGFibGUgb3B0aW9ucyBhcmUgJ3Bhc3NpdmUnIGFuZCAnYWN0aXZlJy5cclxuICAgKiBcclxuICAgKiBQYXNzaXZlIHdpbGwgY2hlY2sgdG8gc2VlIGlmIHRoZSBkYXRhIGlzIGV4cGlyZWQgYXQgdGhlIHRpbWUgaXQgaXMgcXVlcnlpbmcgdGhhdCBkYXRhLiBUaGlzIGlzIHZlcnkgcGVyZm9ybWFudCBhbmQgcGVyZmVjdCBpZiB5b3UncmUgbm90XHJcbiAgICogdXNpbmcgYW5vdGhlciBhcHBsaWNhdGlvbiB0byBxdWVyeSB0aGUgbG9jYWxTdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEFjdGl2ZSB3aWxsIGNoZWNrIGZvciBleHBpcmVkIGRhdGEgb24gYW4gaW50ZXJ2YWwuIEJ5IGRlZmF1bHQgdGhlIGludGVydmFsIGlzIDYwMDAwbXMgYnV0IHRoaXMgY2FuIGJlIGNoYW5nZWQuXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9XHJcbiAgICogXHJcbiAgICogQGRlZmF1bHQgJ3Bhc3NpdmUnXHJcbiAgICovXHJcbiAgZXhwaXJlZENoZWNrVHlwZTogc3RyaW5nID0gJ3Bhc3NpdmUnO1xyXG5cclxuICAvKipcclxuICAgKiBJZiB0aGUgJ2FjdGl2ZScgZXhwaXJlZCBjaGVjayB0eXBlIGlzIHVzZWQgdGhpcyBjYW4gYmUgdXNlZCB0byBhZGp1c3QgdGhlIGNoZWNrIGludGVydmFsLlxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqIFxyXG4gICAqIEBkZWZhdWx0IDYwMDAwXHJcbiAgICovXHJcbiAgZXhwaXJlZENoZWNrSW50ZXJ2YWw6IG51bWJlciA9IDYwMDAwO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIGZyb20gQm94Q3JhdGUuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogT2JqZWN0ID0ge30pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XHJcbiAgfVxyXG59Il19