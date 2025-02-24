(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.i18nextLocalStorageBackend = factory());
}(this, function () { 'use strict';

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

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
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

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(options) {
      _classCallCheck(this, Storage);

      this.store = options.store;
    }

    _createClass(Storage, [{
      key: "setItem",
      value: function setItem(key, value) {
        if (this.store) {
          try {
            this.store.setItem(key, value);
          } catch (e) {// f.log('failed to set value for key "' + key + '" to localStorage.');
          }
        }
      }
    }, {
      key: "getItem",
      value: function getItem(key, value) {
        if (this.store) {
          try {
            return this.store.getItem(key, value);
          } catch (e) {// f.log('failed to get value for key "' + key + '" from localStorage.');
          }
        }

        return undefined;
      }
    }]);

    return Storage;
  }();

  function getDefaults() {
    return {
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
      versions: {},
      store: window.localStorage
    };
  }

  var Cache =
  /*#__PURE__*/
  function () {
    function Cache(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Cache);

      this.init(services, options);
      this.type = 'backend';
    }

    _createClass(Cache, [{
      key: "init",
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.services = services;
        this.options = _objectSpread({}, getDefaults(), this.options, options);
        this.storage = new Storage(this.options);
      }
    }, {
      key: "read",
      value: function read(language, namespace, callback) {
        var nowMS = new Date().getTime();

        if (!this.storage.store) {
          return callback(null, null);
        }

        var local = this.storage.getItem("".concat(this.options.prefix).concat(language, "-").concat(namespace));

        if (local) {
          local = JSON.parse(local);

          if ( // expiration field is mandatory, and should not be expired
          local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS // there should be no language version set, or if it is, it should match the one in translation
          && this.options.versions[language][namespace] && this.options.versions[language][namespace] === local.i18nVersion) {
            delete local.i18nVersion;
            delete local.i18nStamp;
            return callback(null, local);
          }
        }

        return callback(null, null);
      }
    }, {
      key: "save",
      value: function save(language, namespace, data) {
        if (this.storage.store) {
          data.i18nStamp = new Date().getTime(); // language version (if set)

          if (this.options.versions[language][namespace]) {
            data.i18nVersion = this.options.versions[language][namespace];
          } // save


          this.storage.setItem("".concat(this.options.prefix).concat(language, "-").concat(namespace), JSON.stringify(data));
        }
      }
    }]);

    return Cache;
  }();

  Cache.type = 'backend';

  return Cache;

}));
