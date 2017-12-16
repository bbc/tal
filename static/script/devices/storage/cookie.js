/**
 * @fileOverview Requirejs modifier for cookie based storage
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/storage/cookie',
    [
        'antie/devices/browserdevice',
        'antie/storageprovider'
    ],
    function(Device, StorageProvider) {
        'use strict';

        // http://www.quirksmode.org/js/cookies.html
        var namespaces = {};

        var default_days = 366;
        var pathParts = document.location.pathname.split('/');
        pathParts.pop();
        var path = pathParts.join('/') + '/';

        function createCookie(namespace, value, days, opts) {
            value = encodeURIComponent(value);
            days = days || default_days;
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

            var cookiePath = opts.path || path;

            var cookieDataArray = [
                namespace + '=' + value,
                'expires=' + date.toGMTString(),
                'path=' + (opts.isPathless ? '/' : cookiePath)
            ];
            if (opts.domain){
                cookieDataArray.push('domain='+opts.domain);
            }
            if (opts.secure){
                cookieDataArray.push('secure');
            }
            document.cookie = cookieDataArray.join('; ');
        }

        function readCookie(namespace) {
            var nameEQ = namespace + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        }

        function eraseCookie(namespace, opts) {
            createCookie(namespace, '', -1, opts);
        }

        /**
         * Class for persistently storing date in cookies
         * @name antie.devices.storage.CookieStorage
         * @class
         * @extends antie.StorageProvider
         * @param {String} namespace The cookie name to be used for this cookie storage object
         * @param {Object} [opts]
         * @param {String} [opts.domain] The domain value of the cookie, if not provided this is not set on the cookie
         * @param {Boolean} [opts.isPathless] If <code>true</code> sets the path to '/' else retrieves the path from the location
         * @param {String} [opts.path] The path to save the cookie against
         * @param {Boolean} [opts.secure] The storage should be secure. Adds secure flag to cookie
         */
        var CookieStorage = StorageProvider.extend(/** @lends antie.devices.storage.CookieStorage.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function init (namespace, opts) {
                init.base.call(this);

                this._namespace = namespace;
                this._opts = opts || {};

                var cookie = readCookie(namespace);

                if(cookie) {
                    try {
                        this._valueCache = JSON.parse(cookie);
                    } catch (e) { /* couldn't parse cookie, just ignore it */ }
                    if(this._valueCache) {
                        this._save();
                    } else {
                        this._valueCache = {};
                    }
                }
            },
            setItem: function setItem (key, value) {
                setItem.base.call(this, key, value);
                this._save();
            },
            removeItem: function removeItem (key) {
                removeItem.base.call(this, key);
                this._save();
            },
            clear: function clear () {
                clear.base.call(this);
                this._save();

                // delete it from the stored namespaces
                // so it will be reloaded the next time
                // we get it
                delete namespaces[this._namespace];
            },
            _save: function _save () {
                if(this.isEmpty()) {
                    eraseCookie(this._namespace, this._opts);
                } else {
                    var json = JSON.stringify(this._valueCache);
                    createCookie(this._namespace, json, undefined, this._opts);
                }
            }
        });

        Device.prototype.getPersistentStorage = function(namespace, opts) {
            if(!namespaces[namespace]) {
                namespaces[namespace] = new CookieStorage(namespace, opts);
            }
            return namespaces[namespace];
        };
    }
);
