/**
 * @fileOverview Requirejs module for openclosewindow exit strategy.
 * Uses a workaround to make the browser think the current window
 * was opened by JavaScript, allowing window.close() to close it.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/openclosewindow',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by invoking window.open() on the current window,
         * then window.close().
         */
        Device.prototype.exit = function() {
            // Workaround to make the browser think this window was opened via script
            window.open('', '_self');

            // Close the current window
            window.close();
        };
    }
);
