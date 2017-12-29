/**
 * @fileOverview Requirejs modifier exit for netcast
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/broadcast/netcast',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by returning to broadcast using the NetcastExit function.
         */
        Device.prototype.exitToBroadcast = function() {
            window.NetCastExit();
        };

    }
);
