/**
 * @fileOverview Requirejs module containing base antie.devices.exit.closewindow class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/closewindow',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by invoking the window.close method
        */
        Device.prototype.exit = function() {
            window.close();
        };

    }
);
