'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Options = _interopRequireDefault(require("./Options"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var BoxCrate =
/*#__PURE__*/
function () {
  /**
   * A reference to the options for this instance of BoxCrate.
   * 
   * @since 2.0.0
   * 
   * @property {Options}
   */

  /**
   * The id of the setTimeout timer.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */

  /**
   * The timestamp of the previous expired item check.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */

  /**
   * The timestamp of the current expired item check.
   * 
   * @since 2.0.0
   * 
   * @property {number}
   */

  /**
   * A reference to the window localStorage object.
   * 
   * @since 0.1.0
   * 
   * @property {Storage}
   */

  /**
   * The amount of items in storage.
   * 
   * @since 0.1.0
   * 
   * @property {number}
   */

  /**
   * @param {Object} [options]
   * @param {string} [options.expiredCheckType='passive'] The type of check to use for expired data.
   * @param {number} [options.expiredCheckInterval=60000] If 'active' monitoring is used this can be used to change the check interval.
   */
  function BoxCrate(options) {
    _classCallCheck(this, BoxCrate);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "timer", 0);

    _defineProperty(this, "previousCheckTime", 0);

    _defineProperty(this, "currentCheckTime", 0);

    _defineProperty(this, "storage", window.localStorage);

    _defineProperty(this, "count", 0);

    this.options = new _Options["default"](options);
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


  _createClass(BoxCrate, [{
    key: "setItem",
    value: function setItem(id, value) {
      var msToExpire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
      var item = {
        type: '',
        timestamp: 0,
        expires: Infinity,
        data: null
      };

      switch (_typeof(value)) {
        case 'string':
        case 'number':
        case 'boolean':
          item.type = _typeof(value);
          item.data = value.toString();
          break;

        case 'undefined':
          item.type = 'undefined';
          item.data = undefined;
          break;

        case 'object':
          if (Array.isArray(value)) {
            var _value = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var val = _step.value;
                if (_typeof(val) === 'object' && val !== null) val = JSON.stringify(val);

                _value.push(val);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            item.type = 'array';
            item.data = _value.join('|');
          } else if (!value) {
            item.type = 'null';
            item.data = null;
          } else if (value.size) {
            item.type = 'set';
            item.data = _toConsumableArray(value).join();
          } else {
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

  }, {
    key: "getItem",
    value: function getItem(id) {
      if (this.storage.length === 0) return;
      var item = JSON.parse(this.storage.getItem(id));

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

  }, {
    key: "removeItem",
    value: function removeItem(id) {
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

  }, {
    key: "clear",
    value: function clear() {
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

  }, {
    key: "parseItem",
    value: function parseItem(type, data) {
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
          var original = [];
          var saved = data.split('|');
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = saved[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;
              original.push(this.convertString(item));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

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

  }, {
    key: "convertString",
    value: function convertString(value) {
      switch (value) {
        case 'true':
        case 'false':
          return Boolean(value);

        case 'undefined':
          return undefined;

        case 'null':
          return null;

        default:
          if (Number(value)) return Number(value);else {
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

  }, {
    key: "itemIsExpired",
    value: function itemIsExpired(item) {
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

  }, {
    key: "checkForExpiredItems",
    value: function checkForExpiredItems() {
      var _this = this;

      this.currentCheckTime = window.performance.now();

      if (this.currentCheckTime - this.previousCheckTime >= this.options.expiredCheckInterval) {
        for (var key in this.storage) {
          if (this.storage.hasOwnProperty(key) && this.itemIsExpired(JSON.parse(this.storage[key]))) this.removeItem(key);
        }

        this.previousCheckTime = this.currentCheckTime;
      }

      this.timer = window.setTimeout(function () {
        _this.checkForExpiredItems();
      }, this.options.expiredCheckInterval);
    }
    /**
     * Set up the active expired data checking if selected.
     * 
     * @since 0.1.0
     * 
     * @private
     */

  }, {
    key: "boot",
    value: function boot() {
      var _this2 = this;

      if (this.options.expiredCheckType === 'active') {
        this.timer = window.setTimeout(function () {
          _this2.checkForExpiredItems();
        }, this.options.expiredCheckInterval);
      }
    }
  }]);

  return BoxCrate;
}();

exports["default"] = BoxCrate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJCb3hDcmF0ZSIsIm9wdGlvbnMiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJPcHRpb25zIiwiYm9vdCIsImlkIiwidmFsdWUiLCJtc1RvRXhwaXJlIiwiSW5maW5pdHkiLCJpdGVtIiwidHlwZSIsInRpbWVzdGFtcCIsImV4cGlyZXMiLCJkYXRhIiwidG9TdHJpbmciLCJ1bmRlZmluZWQiLCJBcnJheSIsImlzQXJyYXkiLCJfdmFsdWUiLCJ2YWwiLCJKU09OIiwic3RyaW5naWZ5IiwicHVzaCIsImpvaW4iLCJzaXplIiwicGVyZm9ybWFuY2UiLCJub3ciLCJzdG9yYWdlIiwic2V0SXRlbSIsImNvdW50IiwibGVuZ3RoIiwicGFyc2UiLCJnZXRJdGVtIiwiZXhwaXJlZENoZWNrVHlwZSIsIml0ZW1Jc0V4cGlyZWQiLCJyZW1vdmVJdGVtIiwicGFyc2VJdGVtIiwiY2xlYXIiLCJOdW1iZXIiLCJvcmlnaW5hbCIsInNhdmVkIiwic3BsaXQiLCJjb252ZXJ0U3RyaW5nIiwiQm9vbGVhbiIsImVyciIsImN1cnJlbnRDaGVja1RpbWUiLCJwcmV2aW91c0NoZWNrVGltZSIsImV4cGlyZWRDaGVja0ludGVydmFsIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJjaGVja0ZvckV4cGlyZWRJdGVtcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBOzs7Ozs7Ozs7O0lBVXFCQSxROzs7QUFFbkI7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7O0FBS0Esb0JBQVlDLE9BQVosRUFBOEI7QUFBQTs7QUFBQTs7QUFBQSxtQ0EzQ2QsQ0EyQ2M7O0FBQUEsK0NBbENGLENBa0NFOztBQUFBLDhDQXpCSCxDQXlCRzs7QUFBQSxxQ0FoQlhDLE1BQU0sQ0FB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R0FBbkIsRUFBeEI7O0FBRUEsVUFBSSxLQUFLbUIsZ0JBQUwsR0FBd0IsS0FBS0MsaUJBQTdCLElBQWtELEtBQUs5QyxPQUFMLENBQWErQyxvQkFBbkUsRUFBeUY7QUFFdkYsYUFBSyxJQUFNQyxHQUFYLElBQWtCLEtBQUtyQixPQUF2QixFQUFnQztBQUU5QixjQUFJLEtBQUtBLE9BQUwsQ0FBYXNCLGNBQWIsQ0FBNEJELEdBQTVCLEtBQW9DLEtBQUtkLGFBQUwsQ0FBbUJkLElBQUksQ0FBQ1csS0FBTCxDQUFXLEtBQUtKLE9BQUwsQ0FBYXFCLEdBQWIsQ0FBWCxDQUFuQixDQUF4QyxFQUEyRixLQUFLYixVQUFMLENBQWdCYSxHQUFoQjtBQUU1Rjs7QUFFRCxhQUFLRixpQkFBTCxHQUF5QixLQUFLRCxnQkFBOUI7QUFFRDs7QUFFRCxXQUFLSyxLQUFMLEdBQWFqRCxNQUFNLENBQUNrRCxVQUFQLENBQWtCLFlBQU07QUFFbkMsUUFBQSxLQUFJLENBQUNDLG9CQUFMO0FBRUQsT0FKWSxFQUlWLEtBQUtwRCxPQUFMLENBQWErQyxvQkFKSCxDQUFiO0FBTUQ7QUFFRDs7Ozs7Ozs7OzsyQkFPZTtBQUFBOztBQUViLFVBQUksS0FBSy9DLE9BQUwsQ0FBYWlDLGdCQUFiLEtBQWtDLFFBQXRDLEVBQWdEO0FBRTlDLGFBQUtpQixLQUFMLEdBQWFqRCxNQUFNLENBQUNrRCxVQUFQLENBQWtCLFlBQU07QUFFbkMsVUFBQSxNQUFJLENBQUNDLG9CQUFMO0FBR0QsU0FMWSxFQUtWLEtBQUtwRCxPQUFMLENBQWErQyxvQkFMSCxDQUFiO0FBT0Q7QUFFRiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9PcHRpb25zJztcclxuXHJcbmltcG9ydCBJdGVtIGZyb20gJy4vaW50ZXJmYWNlcy9JdGVtJztcclxuXHJcbi8qKlxyXG4gKiBCb3hDcmF0ZSBhYnN0cmFjdHMgdGhlIHVzZSBvZiBsb2NhbFN0b3JhZ2UgcHJvdmlkaW5nIGFuIGVhc3kgdG8gd29yayB3aXRoIGludGVyZmFjZSB3aGlsZSBtYWludGFpbmluZyB0aGUgZnVsbCBmdW5jdGlvbmFsaXR5IFxyXG4gKiBvZiB0aGUgb3JpZ2luYWwgQVBJcy5cclxuICogXHJcbiAqIEJveENyYXRlIHdvcmtzIHdpdGggZGF0YSBhcyBpdCBpcyB3aXRob3V0IHlvdSBoYXZpbmcgdG8gd29ycnkgYWJvdXQgc3RyaW5naWZ5aW5nIGl0IHRvIHNhdmUgaXQuXHJcbiAqIFxyXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxyXG4gKiBcclxuICogQHZlcnNpb24gMi4wLjBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJveENyYXRlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgQm94Q3JhdGUuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDIuMC4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtPcHRpb25zfVxyXG4gICAqL1xyXG4gIG9wdGlvbnM6IE9wdGlvbnM7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBpZCBvZiB0aGUgc2V0VGltZW91dCB0aW1lci5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMi4wLjBcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge251bWJlcn1cclxuICAgKi9cclxuICB0aW1lcjogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHRpbWVzdGFtcCBvZiB0aGUgcHJldmlvdXMgZXhwaXJlZCBpdGVtIGNoZWNrLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAyLjAuMFxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHByZXZpb3VzQ2hlY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgdGltZXN0YW1wIG9mIHRoZSBjdXJyZW50IGV4cGlyZWQgaXRlbSBjaGVjay5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMi4wLjBcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge251bWJlcn1cclxuICAgKi9cclxuICBjdXJyZW50Q2hlY2tUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgd2luZG93IGxvY2FsU3RvcmFnZSBvYmplY3QuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtTdG9yYWdlfVxyXG4gICAqL1xyXG4gIHN0b3JhZ2U6IFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgYW1vdW50IG9mIGl0ZW1zIGluIHN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9XHJcbiAgICovXHJcbiAgY291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZXhwaXJlZENoZWNrVHlwZT0ncGFzc2l2ZSddIFRoZSB0eXBlIG9mIGNoZWNrIHRvIHVzZSBmb3IgZXhwaXJlZCBkYXRhLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5leHBpcmVkQ2hlY2tJbnRlcnZhbD02MDAwMF0gSWYgJ2FjdGl2ZScgbW9uaXRvcmluZyBpcyB1c2VkIHRoaXMgY2FuIGJlIHVzZWQgdG8gY2hhbmdlIHRoZSBjaGVjayBpbnRlcnZhbC5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogT2JqZWN0KSB7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5ib290KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2F2ZXMgYW4gaXRlbS5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMC4xLjBcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGl0ZW0gdXNlZCB0byBtb2RpZnkgb3IgcmV0cmlldmUgaXQuXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgZGF0YSB0byBzYXZlLlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbXNUb0V4cGlyZT1JbmZpbml0eV0gVGhlIGFtb3VudCBvZiB0aW1lLCBpbiBtaWxsaXNlY29uZHMsIHVudGlsIHRoaXMgaXRlbSBpcyBjb25zaWRlcmVkIGV4cGlyZWQuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge0JveENyYXRlfSBSZXR1cm5zIHRoaXMgZm9yIGNoYWluaW5nLlxyXG4gICAqL1xyXG4gIHNldEl0ZW0oaWQ6IHN0cmluZywgdmFsdWU6IGFueSwgbXNUb0V4cGlyZTogbnVtYmVyID0gSW5maW5pdHkpOiBCb3hDcmF0ZSB7XHJcblxyXG4gICAgY29uc3QgaXRlbTogSXRlbSA9IHsgdHlwZTogJycsIHRpbWVzdGFtcDogMCwgZXhwaXJlczogSW5maW5pdHksIGRhdGE6IG51bGwgfTtcclxuXHJcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICBpdGVtLnR5cGUgPSB0eXBlb2YgdmFsdWU7XHJcbiAgICAgICAgaXRlbS5kYXRhID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICAgICAgaXRlbS50eXBlID0gJ3VuZGVmaW5lZCc7XHJcbiAgICAgICAgaXRlbS5kYXRhID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHJcbiAgICAgICAgICBjb25zdCBfdmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCB2YWwgb2YgdmFsdWUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbCkgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbCkgdmFsID0gSlNPTi5zdHJpbmdpZnkodmFsKTtcclxuXHJcbiAgICAgICAgICAgIF92YWx1ZS5wdXNoKHZhbCk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGl0ZW0udHlwZSA9ICdhcnJheSc7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBfdmFsdWUuam9pbignfCcpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICBpdGVtLnR5cGUgPSAnbnVsbCc7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh2YWx1ZS5zaXplKSB7XHJcbiAgICAgICAgICBpdGVtLnR5cGUgPSAnc2V0JztcclxuICAgICAgICAgIGl0ZW0uZGF0YSA9IFsuLi52YWx1ZV0uam9pbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0udHlwZSA9ICdvYmplY3QnO1xyXG4gICAgICAgICAgaXRlbS5kYXRhID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpdGVtLnRpbWVzdGFtcCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICBpdGVtLmV4cGlyZXMgPSBtc1RvRXhwaXJlO1xyXG5cclxuICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGlkLCBKU09OLnN0cmluZ2lmeShpdGVtKSk7XHJcblxyXG4gICAgdGhpcy5jb3VudCsrO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhbiBpdGVtLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgaWQgb2YgdGhlIGl0ZW0gdG8gcmV0cmlldmUgZnJvbSBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgaXRlbS5cclxuICAgKi9cclxuICBnZXRJdGVtKGlkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIGlmICh0aGlzLnN0b3JhZ2UubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgaXRlbTogSXRlbSA9IEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0oaWQpISk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5leHBpcmVkQ2hlY2tUeXBlID09PSAncGFzc2l2ZScgJiYgaXRlbS5leHBpcmVzKSB7XHJcblxyXG4gICAgICBpZiAodGhpcy5pdGVtSXNFeHBpcmVkKGl0ZW0pKSB7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbShpZCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucGFyc2VJdGVtKGl0ZW0udHlwZSwgaXRlbS5kYXRhKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFuIGl0ZW0uXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBpZCBvZiB0aGUgaXRlbSB0byByZW1vdmUgZnJvbSBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHtCb3hDcmF0ZX0gUmV0dXJucyB0aGlzIGZvciBjaGFpbmluZy5cclxuICAgKi9cclxuICByZW1vdmVJdGVtKGlkOiBzdHJpbmcpOiBCb3hDcmF0ZSB7XHJcblxyXG4gICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oaWQpO1xyXG5cclxuICAgIHRoaXMuY291bnQtLTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCBpdGVtcyBmcm9tIHN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge0JveENyYXRlfSBSZXR1cm5zIHRoaXMgZm9yIGNoYWluaW5nLlxyXG4gICAqL1xyXG4gIGNsZWFyKCk6IEJveENyYXRlIHtcclxuXHJcbiAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcclxuXHJcbiAgICB0aGlzLmNvdW50ID0gMDtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJzZSBhbiBpdGVtJ3MgZGF0YSBhbmQgcmV0dXJuIGl0IGluIGl0cyBvcmlnaW5hbCBmb3JtLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAyLjAuMFxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgb2YgZGF0YSB0aGF0IHRoZSBkYXRhIGlzLlxyXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgZGF0YSB0byBwYXJzZS5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcGFyc2VkIGRhdGEgdmFsdWUuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwYXJzZUl0ZW0odHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBhbnkge1xyXG5cclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoZGF0YSk7XHJcblxyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGNhc2UgJ2FycmF5JzpcclxuICAgICAgICBjb25zdCBvcmlnaW5hbDogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHNhdmVkOiBBcnJheTxhbnk+ID0gZGF0YS5zcGxpdCgnfCcpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2F2ZWQpIG9yaWdpbmFsLnB1c2godGhpcy5jb252ZXJ0U3RyaW5nKGl0ZW0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG5cclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR0ZW1wdHMgdG8gY29udmVydCBhIHN0cmluZyB2YWx1ZSBpbnRvIGFub3RoZXIgcHJpbWl0aXZlIG9yIGNvbXBsZXggdHlwZS5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMi4wLjBcclxuICAgKiBcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXR0ZW1wdCB0byBjb252ZXJ0LlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgdmFsdWUuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjb252ZXJ0U3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgY2FzZSAndHJ1ZSc6XHJcbiAgICAgIGNhc2UgJ2ZhbHNlJzpcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih2YWx1ZSk7XHJcblxyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgaWYgKE51bWJlcih2YWx1ZSkpIHJldHVybiBOdW1iZXIodmFsdWUpO1xyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgYW4gaXRlbSBpcyBleHBpcmVkLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAyLjAuMFxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtJdGVtfSBpdGVtIFRoZSBpdGVtIHRvIGNoZWNrIGlmIGV4cGlyZWQuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgaXRlbSBpcyBleHBpcmVkIG9yIGZhbHNlIG90aGVyd2lzZS5cclxuICAgKi9cclxuICBwcml2YXRlIGl0ZW1Jc0V4cGlyZWQoaXRlbTogSXRlbSk6IGJvb2xlYW4ge1xyXG5cclxuICAgIGlmICh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSBpdGVtLnRpbWVzdGFtcCA+PSBpdGVtLmV4cGlyZXMpIHJldHVybiB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgZm9yIGV4cGlyZWQgaXRlbXMgaW4gdGhlIHN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBwcml2YXRlIGNoZWNrRm9yRXhwaXJlZEl0ZW1zKCkge1xyXG5cclxuICAgIHRoaXMuY3VycmVudENoZWNrVGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50Q2hlY2tUaW1lIC0gdGhpcy5wcmV2aW91c0NoZWNrVGltZSA+PSB0aGlzLm9wdGlvbnMuZXhwaXJlZENoZWNrSW50ZXJ2YWwpIHtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc3RvcmFnZSkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdG9yYWdlLmhhc093blByb3BlcnR5KGtleSkgJiYgdGhpcy5pdGVtSXNFeHBpcmVkKEpTT04ucGFyc2UodGhpcy5zdG9yYWdlW2tleV0pKSkgdGhpcy5yZW1vdmVJdGVtKGtleSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnByZXZpb3VzQ2hlY2tUaW1lID0gdGhpcy5jdXJyZW50Q2hlY2tUaW1lO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuICAgICAgdGhpcy5jaGVja0ZvckV4cGlyZWRJdGVtcygpO1xyXG5cclxuICAgIH0sIHRoaXMub3B0aW9ucy5leHBpcmVkQ2hlY2tJbnRlcnZhbCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHVwIHRoZSBhY3RpdmUgZXhwaXJlZCBkYXRhIGNoZWNraW5nIGlmIHNlbGVjdGVkLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBib290KCkge1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwaXJlZENoZWNrVHlwZSA9PT0gJ2FjdGl2ZScpIHtcclxuXHJcbiAgICAgIHRoaXMudGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JFeHBpcmVkSXRlbXMoKTtcclxuXHJcblxyXG4gICAgICB9LCB0aGlzLm9wdGlvbnMuZXhwaXJlZENoZWNrSW50ZXJ2YWwpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufSJdfQ==