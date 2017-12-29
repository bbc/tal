/**
 * @fileOverview Requirejs module containing base antie.devices.exit.sagemcom function.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/sagemcom',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by singalling the application iframe can be closed
         */
        Device.prototype.exit = function() {
            /* global parent: true */
            parent.postMessage('JS_EVENT_QUIT_THIRD_PARTY', '*');
        };
    }
);
