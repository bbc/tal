/**
 * @fileOverview Requirejs module to present temporary storage for the session
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/storage/session',
    ['antie/storageprovider'],
    function(StorageProvider) {
        'use strict';

        var namespaces = {};
        var SessionStorage = StorageProvider.extend({});

        SessionStorage.getNamespace = function(namespace) {
            if(!namespaces[namespace]) {
                namespaces[namespace] = new SessionStorage();
            }
            return namespaces[namespace];
        };

        return SessionStorage;
    }
);
