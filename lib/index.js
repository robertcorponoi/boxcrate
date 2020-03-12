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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * BoxCrate abstracts the use of localStorage providing an easy to work with interface while maintaining the full functionality 
 * of the original APIs.
 * 
 * BoxCrate works with data as it is without you having to worry about stringifying it to save it.
 */
var BoxCrate = /*#__PURE__*/function () {
  /**
   * A reference to the options for this instance of BoxCrate.
   * 
   * @private
   * 
   * @property {Options}
   */

  /**
   * The id of the setTimeout timer.
   * 
   * @private
   * 
   * @property {number}
   */

  /**
   * The timestamp of the previous expired item check.
   * 
   * @property {number}
   */

  /**
   * The timestamp of the current expired item check.
   * 
   * @property {number}
   */

  /**
   * A reference to the window localStorage object.
   * 
   * @property {Storage}
   */

  /**
   * The amount of items in storage.
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

    _defineProperty(this, "_options", void 0);

    _defineProperty(this, "_timer", 0);

    _defineProperty(this, "_previousCheckTime", 0);

    _defineProperty(this, "_currentCheckTime", 0);

    _defineProperty(this, "_storage", window.localStorage);

    _defineProperty(this, "_count", 0);

    this._options = new _Options["default"](options);

    this._boot();
  }
  /**
   * Returns the storage oboject.
   * 
   * @returns {Storage}
   */


  _createClass(BoxCrate, [{
    key: "setItem",

    /**
     * Saves an item.
     * 
     * @param {string} id The unique id of this item used to modify or retrieve it.
     * @param {*} value The data to save.
     * @param {number} [msToExpire=Infinity] The amount of time, in milliseconds, until this item is considered expired.
     * 
     * @returns {BoxCrate} Returns this for chaining.
     */
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

  }, {
    key: "getItem",
    value: function getItem(id) {
      if (this._storage.length === 0) return;
      var item = JSON.parse(this._storage.getItem(id));

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

  }, {
    key: "removeItem",
    value: function removeItem(id) {
      this._storage.removeItem(id);

      this._count--;
      return this;
    }
    /**
     * Removes all items from storage.
     * 
     * @returns {BoxCrate} Returns this for chaining.
     */

  }, {
    key: "clear",
    value: function clear() {
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

  }, {
    key: "_parseItem",
    value: function _parseItem(type, data) {
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
              original.push(this._convertString(item));
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
     * @private
     * 
     * @param {string} value The value to attempt to convert.
     * 
     * @returns {*} Returns the converted value.
     */

  }, {
    key: "_convertString",
    value: function _convertString(value) {
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
     * @private
     * 
     * @param {Item} item The item to check if expired.
     * 
     * @returns {boolean} Returns true if the item is expired or false otherwise.
     */

  }, {
    key: "_itemIsExpired",
    value: function _itemIsExpired(item) {
      if (window.performance.now() - item.timestamp >= item.expires) return true;
      return false;
    }
    /**
     * Checks for expired items in the storage.
     * 
     * @private
     */

  }, {
    key: "_checkForExpiredItems",
    value: function _checkForExpiredItems() {
      var _this = this;

      this._currentCheckTime = window.performance.now();

      if (this._currentCheckTime - this._previousCheckTime >= this._options.expiredCheckInterval) {
        for (var key in this._storage) {
          if (this._storage.hasOwnProperty(key) && this._itemIsExpired(JSON.parse(this._storage[key]))) this.removeItem(key);
        }

        this._previousCheckTime = this._currentCheckTime;
      }

      this._timer = window.setTimeout(function () {
        _this._checkForExpiredItems();
      }, this._options.expiredCheckInterval);
    }
    /**
     * Set up the active expired data checking if selected.
     * 
     * @private
     */

  }, {
    key: "_boot",
    value: function _boot() {
      var _this2 = this;

      if (this._options.expiredCheckType === 'active') {
        this._timer = window.setTimeout(function () {
          _this2._checkForExpiredItems();
        }, this._options.expiredCheckInterval);
      }
    }
  }, {
    key: "storage",
    get: function get() {
      return this._storage;
    }
    /**
     * Returns the amount of items in storage.
     * 
     * @returns {number}
     */

  }, {
    key: "count",
    get: function get() {
      return this._count;
    }
  }]);

  return BoxCrate;
}();

exports["default"] = BoxCrate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJCb3hDcmF0ZSIsIm9wdGlvbnMiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJfb3B0aW9ucyIsIk9wdGlvbnMiLCJfYm9vdCIsImlkIiwidmFsdWUiLCJtc1RvRXhwaXJlIiwiSW5maW5pdHkiLCJpdGVtIiwidHlwZSIsInRpbWVzdGFtcCIsImV4cGlyZXMiLCJkYXRhIiwidG9TdHJpbmciLCJ1bmRlZmluZWQiLCJBcnJheSIsImlzQXJyYXkiLCJfdmFsdWUiLCJ2YWwiLCJKU09OIiwic3RyaW5naWZ5IiwicHVzaCIsImpvaW4iLCJzaXplIiwicGVyZm9ybWFuY2UiLCJub3ciLCJfc3RvcmFnZSIsInNldEl0ZW0iLCJfY291bnQiLCJsZW5ndGgiLCJwYXJzZSIsImdldEl0ZW0iLCJleHBpcmVkQ2hlY2tUeXBlIiwiX2l0ZW1Jc0V4cGlyZWQiLCJyZW1vdmVJdGVtIiwiX3BhcnNlSXRlbSIsImNsZWFyIiwiTnVtYmVyIiwib3JpZ2luYWwiLCJzYXZlZCIsInNwbGl0IiwiX2NvbnZlcnRTdHJpbmciLCJCb29sZWFuIiwiZXJyIiwiX2N1cnJlbnRDaGVja1RpbWUiLCJfcHJldmlvdXNDaGVja1RpbWUiLCJleHBpcmVkQ2hlY2tJbnRlcnZhbCIsImtleSIsImhhc093blByb3BlcnR5IiwiX3RpbWVyIiwic2V0VGltZW91dCIsIl9jaGVja0ZvckV4cGlyZWRJdGVtcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBOzs7Ozs7SUFNcUJBLFE7QUFDbkI7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBU0E7Ozs7OztBQU9BOzs7Ozs7QUFPQTs7Ozs7O0FBT0E7Ozs7OztBQU9BOzs7OztBQUtBLG9CQUFZQyxPQUFaLEVBQThCO0FBQUE7O0FBQUE7O0FBQUEsb0NBbkNMLENBbUNLOztBQUFBLGdEQTVCTyxDQTRCUDs7QUFBQSwrQ0FyQk0sQ0FxQk47O0FBQUEsc0NBZEZDLE1B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QUFtQkMsR0FBbkIsRUFBekI7O0FBRUEsVUFBSSxLQUFLbUIsaUJBQUwsR0FBeUIsS0FBS0Msa0JBQTlCLElBQW9ELEtBQUs1QyxRQUFMLENBQWM2QyxvQkFBdEUsRUFBNEY7QUFDMUYsYUFBSyxJQUFNQyxHQUFYLElBQWtCLEtBQUtyQixRQUF2QixFQUFpQztBQUMvQixjQUFJLEtBQUtBLFFBQUwsQ0FBY3NCLGNBQWQsQ0FBNkJELEdBQTdCLEtBQXFDLEtBQUtkLGNBQUwsQ0FBb0JkLElBQUksQ0FBQ1csS0FBTCxDQUFXLEtBQUtKLFFBQUwsQ0FBY3FCLEdBQWQsQ0FBWCxDQUFwQixDQUF6QyxFQUE4RixLQUFLYixVQUFMLENBQWdCYSxHQUFoQjtBQUMvRjs7QUFDRCxhQUFLRixrQkFBTCxHQUEwQixLQUFLRCxpQkFBL0I7QUFDRDs7QUFFRCxXQUFLSyxNQUFMLEdBQWNsRCxNQUFNLENBQUNtRCxVQUFQLENBQWtCLFlBQU07QUFDcEMsUUFBQSxLQUFJLENBQUNDLHFCQUFMO0FBQ0QsT0FGYSxFQUVYLEtBQUtsRCxRQUFMLENBQWM2QyxvQkFGSCxDQUFkO0FBR0Q7QUFFRDs7Ozs7Ozs7NEJBS2dCO0FBQUE7O0FBQ2QsVUFBSSxLQUFLN0MsUUFBTCxDQUFjK0IsZ0JBQWQsS0FBbUMsUUFBdkMsRUFBaUQ7QUFDL0MsYUFBS2lCLE1BQUwsR0FBY2xELE1BQU0sQ0FBQ21ELFVBQVAsQ0FBa0IsWUFBTTtBQUNwQyxVQUFBLE1BQUksQ0FBQ0MscUJBQUw7QUFDRCxTQUZhLEVBRVgsS0FBS2xELFFBQUwsQ0FBYzZDLG9CQUZILENBQWQ7QUFHRDtBQUNGOzs7d0JBdk9zQjtBQUFFLGFBQU8sS0FBS3BCLFFBQVo7QUFBdUI7QUFFaEQ7Ozs7Ozs7O3dCQUtvQjtBQUFFLGFBQU8sS0FBS0UsTUFBWjtBQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9PcHRpb25zJztcclxuXHJcbmltcG9ydCBJdGVtIGZyb20gJy4vaW50ZXJmYWNlcy9JdGVtJztcclxuXHJcbi8qKlxyXG4gKiBCb3hDcmF0ZSBhYnN0cmFjdHMgdGhlIHVzZSBvZiBsb2NhbFN0b3JhZ2UgcHJvdmlkaW5nIGFuIGVhc3kgdG8gd29yayB3aXRoIGludGVyZmFjZSB3aGlsZSBtYWludGFpbmluZyB0aGUgZnVsbCBmdW5jdGlvbmFsaXR5IFxyXG4gKiBvZiB0aGUgb3JpZ2luYWwgQVBJcy5cclxuICogXHJcbiAqIEJveENyYXRlIHdvcmtzIHdpdGggZGF0YSBhcyBpdCBpcyB3aXRob3V0IHlvdSBoYXZpbmcgdG8gd29ycnkgYWJvdXQgc3RyaW5naWZ5aW5nIGl0IHRvIHNhdmUgaXQuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3hDcmF0ZSB7XHJcbiAgLyoqXHJcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgQm94Q3JhdGUuXHJcbiAgICogXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge09wdGlvbnN9XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfb3B0aW9uczogT3B0aW9ucztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGlkIG9mIHRoZSBzZXRUaW1lb3V0IHRpbWVyLlxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfdGltZXI6IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB0aW1lc3RhbXAgb2YgdGhlIHByZXZpb3VzIGV4cGlyZWQgaXRlbSBjaGVjay5cclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge251bWJlcn1cclxuICAgKi9cclxuICBwcml2YXRlIF9wcmV2aW91c0NoZWNrVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHRpbWVzdGFtcCBvZiB0aGUgY3VycmVudCBleHBpcmVkIGl0ZW0gY2hlY2suXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfY3VycmVudENoZWNrVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIHdpbmRvdyBsb2NhbFN0b3JhZ2Ugb2JqZWN0LlxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7U3RvcmFnZX1cclxuICAgKi9cclxuICBwcml2YXRlIF9zdG9yYWdlOiBTdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGFtb3VudCBvZiBpdGVtcyBpbiBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmV4cGlyZWRDaGVja1R5cGU9J3Bhc3NpdmUnXSBUaGUgdHlwZSBvZiBjaGVjayB0byB1c2UgZm9yIGV4cGlyZWQgZGF0YS5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZXhwaXJlZENoZWNrSW50ZXJ2YWw9NjAwMDBdIElmICdhY3RpdmUnIG1vbml0b3JpbmcgaXMgdXNlZCB0aGlzIGNhbiBiZSB1c2VkIHRvIGNoYW5nZSB0aGUgY2hlY2sgaW50ZXJ2YWwuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IE9iamVjdCkge1xyXG4gICAgdGhpcy5fb3B0aW9ucyA9IG5ldyBPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuX2Jvb3QoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0b3JhZ2Ugb2JvamVjdC5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7U3RvcmFnZX1cclxuICAgKi9cclxuICBnZXQgc3RvcmFnZSgpOiBTdG9yYWdlIHsgcmV0dXJuIHRoaXMuX3N0b3JhZ2U7IH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYW1vdW50IG9mIGl0ZW1zIGluIHN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICBnZXQgY291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NvdW50OyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmVzIGFuIGl0ZW0uXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSB1bmlxdWUgaWQgb2YgdGhpcyBpdGVtIHVzZWQgdG8gbW9kaWZ5IG9yIHJldHJpZXZlIGl0LlxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIGRhdGEgdG8gc2F2ZS5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gW21zVG9FeHBpcmU9SW5maW5pdHldIFRoZSBhbW91bnQgb2YgdGltZSwgaW4gbWlsbGlzZWNvbmRzLCB1bnRpbCB0aGlzIGl0ZW0gaXMgY29uc2lkZXJlZCBleHBpcmVkLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHtCb3hDcmF0ZX0gUmV0dXJucyB0aGlzIGZvciBjaGFpbmluZy5cclxuICAgKi9cclxuICBzZXRJdGVtKGlkOiBzdHJpbmcsIHZhbHVlOiBhbnksIG1zVG9FeHBpcmU6IG51bWJlciA9IEluZmluaXR5KTogQm94Q3JhdGUge1xyXG4gICAgY29uc3QgaXRlbTogSXRlbSA9IHsgdHlwZTogJycsIHRpbWVzdGFtcDogMCwgZXhwaXJlczogSW5maW5pdHksIGRhdGE6IG51bGwgfTtcclxuXHJcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICBpdGVtLnR5cGUgPSB0eXBlb2YgdmFsdWU7XHJcbiAgICAgICAgaXRlbS5kYXRhID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICAgICAgaXRlbS50eXBlID0gJ3VuZGVmaW5lZCc7XHJcbiAgICAgICAgaXRlbS5kYXRhID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIGNvbnN0IF92YWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHZhbCBvZiB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh2YWwpID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGwpIHZhbCA9IEpTT04uc3RyaW5naWZ5KHZhbCk7XHJcblxyXG4gICAgICAgICAgICBfdmFsdWUucHVzaCh2YWwpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGl0ZW0udHlwZSA9ICdhcnJheSc7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBfdmFsdWUuam9pbignfCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIGl0ZW0udHlwZSA9ICdudWxsJztcclxuICAgICAgICAgIGl0ZW0uZGF0YSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHZhbHVlLnNpemUpIHtcclxuICAgICAgICAgIGl0ZW0udHlwZSA9ICdzZXQnO1xyXG4gICAgICAgICAgaXRlbS5kYXRhID0gWy4uLnZhbHVlXS5qb2luKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS50eXBlID0gJ29iamVjdCc7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZW0udGltZXN0YW1wID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgIGl0ZW0uZXhwaXJlcyA9IG1zVG9FeHBpcmU7XHJcblxyXG4gICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKGlkLCBKU09OLnN0cmluZ2lmeShpdGVtKSk7XHJcblxyXG4gICAgdGhpcy5fY291bnQrKztcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhbiBpdGVtLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgaWQgb2YgdGhlIGl0ZW0gdG8gcmV0cmlldmUgZnJvbSBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgaXRlbS5cclxuICAgKi9cclxuICBnZXRJdGVtKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgaWYgKHRoaXMuX3N0b3JhZ2UubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgaXRlbTogSXRlbSA9IEpTT04ucGFyc2UodGhpcy5fc3RvcmFnZS5nZXRJdGVtKGlkKSEpO1xyXG5cclxuICAgIGlmICh0aGlzLl9vcHRpb25zLmV4cGlyZWRDaGVja1R5cGUgPT09ICdwYXNzaXZlJyAmJiBpdGVtLmV4cGlyZXMpIHtcclxuICAgICAgaWYgKHRoaXMuX2l0ZW1Jc0V4cGlyZWQoaXRlbSkpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUl0ZW0oaWQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlSXRlbShpdGVtLnR5cGUsIGl0ZW0uZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFuIGl0ZW0uXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBpZCBvZiB0aGUgaXRlbSB0byByZW1vdmUgZnJvbSBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHtCb3hDcmF0ZX0gUmV0dXJucyB0aGlzIGZvciBjaGFpbmluZy5cclxuICAgKi9cclxuICByZW1vdmVJdGVtKGlkOiBzdHJpbmcpOiBCb3hDcmF0ZSB7XHJcbiAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZUl0ZW0oaWQpO1xyXG5cclxuICAgIHRoaXMuX2NvdW50LS07XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCBpdGVtcyBmcm9tIHN0b3JhZ2UuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge0JveENyYXRlfSBSZXR1cm5zIHRoaXMgZm9yIGNoYWluaW5nLlxyXG4gICAqL1xyXG4gIGNsZWFyKCk6IEJveENyYXRlIHtcclxuICAgIHRoaXMuX3N0b3JhZ2UuY2xlYXIoKTtcclxuXHJcbiAgICB0aGlzLl9jb3VudCA9IDA7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXJzZSBhbiBpdGVtJ3MgZGF0YSBhbmQgcmV0dXJuIGl0IGluIGl0cyBvcmlnaW5hbCBmb3JtLlxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgb2YgZGF0YSB0aGF0IHRoZSBkYXRhIGlzLlxyXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgZGF0YSB0byBwYXJzZS5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcGFyc2VkIGRhdGEgdmFsdWUuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfcGFyc2VJdGVtKHR5cGU6IHN0cmluZywgZGF0YTogYW55KTogYW55IHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihkYXRhKTtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICAgICAgY29uc3Qgc2F2ZWQ6IEFycmF5PGFueT4gPSBkYXRhLnNwbGl0KCd8Jyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBzYXZlZCkgb3JpZ2luYWwucHVzaCh0aGlzLl9jb252ZXJ0U3RyaW5nKGl0ZW0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGVtcHRzIHRvIGNvbnZlcnQgYSBzdHJpbmcgdmFsdWUgaW50byBhbm90aGVyIHByaW1pdGl2ZSBvciBjb21wbGV4IHR5cGUuXHJcbiAgICogXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIHRvIGF0dGVtcHQgdG8gY29udmVydC5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY29udmVydGVkIHZhbHVlLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NvbnZlcnRTdHJpbmcodmFsdWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgIGNhc2UgJ3RydWUnOlxyXG4gICAgICBjYXNlICdmYWxzZSc6XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odmFsdWUpO1xyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIGNhc2UgJ251bGwnOlxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGlmIChOdW1iZXIodmFsdWUpKSByZXR1cm4gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhbiBpdGVtIGlzIGV4cGlyZWQuXHJcbiAgICogXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge0l0ZW19IGl0ZW0gVGhlIGl0ZW0gdG8gY2hlY2sgaWYgZXhwaXJlZC5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBpdGVtIGlzIGV4cGlyZWQgb3IgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2l0ZW1Jc0V4cGlyZWQoaXRlbTogSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIGl0ZW0udGltZXN0YW1wID49IGl0ZW0uZXhwaXJlcykgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIGZvciBleHBpcmVkIGl0ZW1zIGluIHRoZSBzdG9yYWdlLlxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfY2hlY2tGb3JFeHBpcmVkSXRlbXMoKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50Q2hlY2tUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgIGlmICh0aGlzLl9jdXJyZW50Q2hlY2tUaW1lIC0gdGhpcy5fcHJldmlvdXNDaGVja1RpbWUgPj0gdGhpcy5fb3B0aW9ucy5leHBpcmVkQ2hlY2tJbnRlcnZhbCkge1xyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9zdG9yYWdlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0b3JhZ2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0aGlzLl9pdGVtSXNFeHBpcmVkKEpTT04ucGFyc2UodGhpcy5fc3RvcmFnZVtrZXldKSkpIHRoaXMucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX3ByZXZpb3VzQ2hlY2tUaW1lID0gdGhpcy5fY3VycmVudENoZWNrVGltZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl90aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5fY2hlY2tGb3JFeHBpcmVkSXRlbXMoKTtcclxuICAgIH0sIHRoaXMuX29wdGlvbnMuZXhwaXJlZENoZWNrSW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHVwIHRoZSBhY3RpdmUgZXhwaXJlZCBkYXRhIGNoZWNraW5nIGlmIHNlbGVjdGVkLlxyXG4gICAqIFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfYm9vdCgpIHtcclxuICAgIGlmICh0aGlzLl9vcHRpb25zLmV4cGlyZWRDaGVja1R5cGUgPT09ICdhY3RpdmUnKSB7XHJcbiAgICAgIHRoaXMuX3RpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NoZWNrRm9yRXhwaXJlZEl0ZW1zKCk7XHJcbiAgICAgIH0sIHRoaXMuX29wdGlvbnMuZXhwaXJlZENoZWNrSW50ZXJ2YWwpO1xyXG4gICAgfVxyXG4gIH1cclxufSJdfQ==