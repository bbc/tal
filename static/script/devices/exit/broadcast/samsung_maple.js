/* global Common */

/**
 * @fileOverview Requirejs modifier for samsung_maple exit
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/broadcast/samsung_maple',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by returning to broadcast using the Samsung API.
         */
        Device.prototype.exitToBroadcast = function() {
            new Common.API.Widget().sendExitEvent();
        };

    }
);
