/**
 * @fileOverview Requirejs module containing the CallbackManager utility class.
 *
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def('antie/callbackmanager',
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
            init: function() {
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
            addCallback: function(thisArg, callback) {
                if (this._getIndexOf(thisArg,callback) === undefined) {
                    this._callbacks.push([thisArg, callback]);
                }
            },

            /**
             * Remove the specified callback.
             * @param {Object} thisArg The object that was used as "this" when adding the callback.
             * @param {Function} callback The callback function
             */
            removeCallback: function(thisArg, callback) {
                var foundIndex = this._getIndexOf(thisArg,callback);

                if (foundIndex !== undefined) {
                    this._callbacks.splice(foundIndex, 1);
                }
            },

            _getIndexOf: function(thisArg, callback) {
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
            removeAllCallbacks: function() {
                this._callbacks = [ ];
            },

            /**
             * Call all callbacks, providing all supplied arguments to each of the calls.
             * @example manager.callAll(1);
             * @example manager.callAll(1,2,3,4);
             */
            callAll: function() {
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
