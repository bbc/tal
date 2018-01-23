/**
 * @fileOverview Requirejs module for openclosewindow exit strategy.
 * Uses a workaround to make the browser think the current window
 * was opened by JavaScript, allowing window.close() to close it.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/openclosewindow',
    [
        'antie/devices/browserdevice',
        'antie/lib/tal-exit-strategies'
    ],
    function (Device, Exit) {
        'use strict';

        Device.prototype.exit = function() {
            Exit.openCloseWindow();
        };
    }
);
