/**
 * @fileOverview Requirejs module containing base antie.devices.exit.history class
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/history',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by navigating to the first page in the browsers history.
         */
        Device.prototype.exit = function() {
            var startPage = history.length -1;
            history.go(-startPage);
        };

    }
);
