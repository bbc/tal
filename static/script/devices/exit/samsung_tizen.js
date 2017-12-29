/**
 * @fileOverview Requirejs module for Tizen exit strategy.
 * Relies on Samsung official documentation for Tizen located at:
 * http://www.samsungdforum.com/tizenapiguidie
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/samsung_tizen',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by invoking exit() on the current application.
         */
        Device.prototype.exit = function() {
            // From http://www.samsungdforum.com/tizenapiguide/
            /* global tizen: true */
            tizen.application.getCurrentApplication().exit();
        };
    }
);
