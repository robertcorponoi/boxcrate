'use strict';
/**
 * Defines the options available and their defaults for BoxCrate.
 * 
 * @since 2.0.0
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
 * @since 2.0.0
 * 
 * @property {string}
 * 
 * @default 'passive'
 */

/**
 * If the 'active' expired check type is used this can be used to adjust the check interval.
 * 
 * @since 2.0.0
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PcHRpb25zLnRzIl0sIm5hbWVzIjpbIk9wdGlvbnMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7SUFLcUJBLE87QUFFbkI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBOzs7Ozs7Ozs7O0FBV0E7OztBQUdBLG1CQUFrQztBQUFBLE1BQXRCQyxPQUFzQix1RUFBSixFQUFJOztBQUFBOztBQUFBLDRDQWhCUCxTQWdCTzs7QUFBQSxnREFMSCxLQUtHOztBQUVoQ0MsRUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxFQUFvQkYsT0FBcEI7QUFFRCxDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKipcclxuICogRGVmaW5lcyB0aGUgb3B0aW9ucyBhdmFpbGFibGUgYW5kIHRoZWlyIGRlZmF1bHRzIGZvciBCb3hDcmF0ZS5cclxuICogXHJcbiAqIEBzaW5jZSAyLjAuMFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3B0aW9ucyB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB0eXBlIG9mIGV4cGlyZWQgZGF0YSBjaGVja2luZyB0byB1c2UuXHJcbiAgICogXHJcbiAgICogVGhlIGF2YWlsYWJsZSBvcHRpb25zIGFyZSAncGFzc2l2ZScgYW5kICdhY3RpdmUnLlxyXG4gICAqIFxyXG4gICAqIFBhc3NpdmUgd2lsbCBjaGVjayB0byBzZWUgaWYgdGhlIGRhdGEgaXMgZXhwaXJlZCBhdCB0aGUgdGltZSBpdCBpcyBxdWVyeWluZyB0aGF0IGRhdGEuIFRoaXMgaXMgdmVyeSBwZXJmb3JtYW50IGFuZCBwZXJmZWN0IGlmIHlvdSdyZSBub3RcclxuICAgKiB1c2luZyBhbm90aGVyIGFwcGxpY2F0aW9uIHRvIHF1ZXJ5IHRoZSBsb2NhbFN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQWN0aXZlIHdpbGwgY2hlY2sgZm9yIGV4cGlyZWQgZGF0YSBvbiBhbiBpbnRlcnZhbC4gQnkgZGVmYXVsdCB0aGUgaW50ZXJ2YWwgaXMgNjAwMDBtcyBidXQgdGhpcyBjYW4gYmUgY2hhbmdlZC5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMi4wLjBcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge3N0cmluZ31cclxuICAgKiBcclxuICAgKiBAZGVmYXVsdCAncGFzc2l2ZSdcclxuICAgKi9cclxuICBleHBpcmVkQ2hlY2tUeXBlOiBzdHJpbmcgPSAncGFzc2l2ZSc7XHJcblxyXG4gIC8qKlxyXG4gICAqIElmIHRoZSAnYWN0aXZlJyBleHBpcmVkIGNoZWNrIHR5cGUgaXMgdXNlZCB0aGlzIGNhbiBiZSB1c2VkIHRvIGFkanVzdCB0aGUgY2hlY2sgaW50ZXJ2YWwuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDIuMC4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9XHJcbiAgICogXHJcbiAgICogQGRlZmF1bHQgNjAwMDBcclxuICAgKi9cclxuICBleHBpcmVkQ2hlY2tJbnRlcnZhbDogbnVtYmVyID0gNjAwMDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMgZnJvbSBCb3hDcmF0ZS5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPYmplY3QgPSB7fSkge1xyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XHJcblxyXG4gIH1cclxuXHJcbn0iXX0=