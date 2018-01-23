/**
 * @fileOverview Requirejs modifier exit for netcast
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/broadcast/netcast',
    [
        'antie/devices/browserdevice',
        'antie/lib/tal-exit-strategies'
    ],
    function (Device, Exit) {
        'use strict';

        Device.prototype.exitToBroadcast = function() {
            Exit.netcastBroadcast();
        };

    }
);
