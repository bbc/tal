/**
 * @fileOverview Requirejs module containing the CallbackManager utility class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/callbackmanager',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';

        /**
         * Utility class to deal with adding/removing callbacks and calling all current callbacks.
         * @name antie.CallbackManager
         * @class
         * @extends antie.Class
         */
        return Class.extend(/** @lends antie.CallbackManager.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {
                this._callbacks = [ ];
            },

            /**
             * Add a callback.
             *
             * Note that failing to remove callbacks when you are finished with them can stop garbage collection
             * of objects/closures containing those callbacks and so create memory leaks in your application.
             * @param {Object} thisArg The object to use as "this" when calling the callback.
             * @param {Function} callback The callback function
             */
            addCallback: function addCallback (thisArg, callback) {
                if (this._getIndexOf(thisArg,callback) === undefined) {
                    this._callbacks.push([thisArg, callback]);
                }
            },

            /**
             * Remove the specified callback.
             * @param {Object} thisArg The object that was used as "this" when adding the callback.
             * @param {Function} callback The callback function
             */
            removeCallback: function removeCallback (thisArg, callback) {
                var foundIndex = this._getIndexOf(thisArg,callback);

                if (foundIndex !== undefined) {
                    this._callbacks.splice(foundIndex, 1);
                }
            },

            _getIndexOf: function _getIndexOf (thisArg, callback) {
                var result;
                for (var i = 0; i < this._callbacks.length; i++) {
                    if (this._callbacks[i][0] === thisArg && this._callbacks[i][1] === callback) {
                        result = i;
                        break;
                    }
                }
                return result;
            },


            /**
             * Remove all callbacks.
             */
            removeAllCallbacks: function removeAllCallbacks () {
                this._callbacks = [ ];
            },

            /**
             * Call all callbacks, providing all supplied arguments to each of the calls.
             * @example manager.callAll(1);
             * @example manager.callAll(1,2,3,4);
             */
            callAll: function callAll () {
                // Convert arguments object to args array.
                var args = Array.prototype.slice.call(arguments);

                for (var i = 0; i < this._callbacks.length; i++) {
                    var thisArg = this._callbacks[i][0];
                    var callback = this._callbacks[i][1];
                    callback.apply(thisArg, args);
                }
            }
        });
    }
);
