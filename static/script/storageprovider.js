/**
 * @fileOverview Requirejs module for storage provider base class
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/storageprovider',
    ['antie/class'],
    function(Class) {
        'use strict';

        var StorageProvider = Class.extend({
            init: function init () {
                this._valueCache = {};
            },
            getItem: function getItem (key) {
                return this._valueCache[key];
            },
            setItem: function setItem (key, value) {
                this._valueCache[key] = value;
            },
            removeItem: function removeItem (key) {
                delete this._valueCache[key];
            },
            clear: function clear () {
                this._valueCache = {};
            },
            isEmpty: function isEmpty () {
                var prop;
                for(prop in this._valueCache) {
                    if(this._valueCache.hasOwnProperty(prop)) {
                        return false;
                    }
                }
                return true;
            }
        });

        StorageProvider.STORAGE_TYPE_SESSION = 0;
        StorageProvider.STORAGE_TYPE_PERSISTENT = 1;

        return StorageProvider;
    }
);
