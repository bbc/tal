/**
 * @fileOverview Requirejs module for android exit strategy.
 * Uses a callback into 'Android' namespace for android WebView (or similar)
 * environment, to let Java-native application code clean up window/activity.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/android',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by invoking window.open() on the current window,
         * then window.close().
         */
        Device.prototype.exit = function() {
            /* Call into named 'Android' namespace to have Java handle exit. */
            /* global Android */
            Android.nativeApplicationExit();
        };
    }
);
