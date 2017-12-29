/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/storage/xboxpls',
    [
        'antie/devices/browserdevice',
        'antie/storageprovider'
    ],
    function(Device, StorageProvider) {
        'use strict';

        var namespaces = {};

        var XboxStorage = StorageProvider.extend({
            init: function init () {
                /* global Windows: true */
                this._storage = Windows.Storage.ApplicationData.current.localSettings.values;

            },

            getItem: function getItem (key) {
                if (this._storage.hasKey(key)) {
                    var value = this._storage.lookup(key);
                    var jsonifiedValue = JSON.parse(value);

                    if (jsonifiedValue === null) {
                        return undefined;
                    }

                    return jsonifiedValue;
                }
                return undefined;
            },

            setItem: function setItem (key, value) {
                this._storage.insert(key, JSON.stringify(value));
            },

            removeItem: function removeItem (key) {
                this._storage.insert(key, null);
            },

            clear: function clear () {
                this._storage.clear();
            },

            isEmpty: function isEmpty () {
                return this._storage.Size === 0;
            }
        });

        Device.prototype.getPersistentStorage = function(namespace) {
            if(!namespaces[namespace]) {
                namespaces[namespace] = new XboxStorage(namespace);
            }
            return namespaces[namespace];
        };
    }
);
