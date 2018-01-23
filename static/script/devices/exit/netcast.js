/**
 * @fileOverview Requirejs module containing base antie.devices.exit.netcast class
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/netcast',
    [
        'antie/devices/browserdevice',
        'antie/lib/tal-exit-strategies'
    ],
    function (Device, Exit) {
        'use strict';

        Device.prototype.exit = function() {
            Exit.netcast();
        };
    }
);
