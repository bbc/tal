/**
 * @fileOverview Requirejs module containing the antie.devices.exit.tivo class for use with
 * tivo html-based system browser.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/tivo',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by returning to the widget page using the tivo function.
         */
        Device.prototype.exit = function() {
            /* global tivo: true */
            tivo.core.exit();
        };

    }
);
