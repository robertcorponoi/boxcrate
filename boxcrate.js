function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

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

/**
 * BoxCrate abstracts the use of localStorage providing an easy to work with interface while maintaining the full functionality 
 * of the original APIs.
 * 
 * BoxCrate works with data as it is without you having to worry about stringifying it to save it.
 */
var BoxCrate =
/*#__PURE__*/
function () {
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

    this._options = new Options(options);

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

export default BoxCrate;
