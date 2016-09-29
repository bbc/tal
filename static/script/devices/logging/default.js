/**
 * @fileOverview Requirejs module containing base antie.devices.logging.default class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

//logs to the javascript console
define(
    'antie/devices/logging/default',
    [
        'module',
        'antie/devices/device'
    ],
    function( Module, Device ) {
        'use strict';

        var loggingMethods = {
            /**
             * Sets the iterator pointer to the first item
             */
            log: function() {
                console.log.apply(console, arguments);
            },
            debug: function() {
                console.debug.apply(console, arguments);
            },
            info: function() {
                console.info.apply(console, arguments);
            },
            warn: function() {
                console.warn.apply(console, arguments);
            },
            error: function() {
                console.error.apply(console, arguments);
            }
        };

        Device.addLoggingStrategy( Module.id, loggingMethods );
    }
);
