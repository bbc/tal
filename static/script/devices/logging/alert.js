/**
 * @fileOverview Requirejs module containing base antie.devices.logging.alert class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/logging/alert',
    [
        'module',
        'antie/devices/device'
    ],
    function( Module, Device) {
        'use strict';

        var loggingMethods = {
            /**
             * Sets the iterator pointer to the first item
             */
            log: function() {
                alert('[LOG] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            debug: function() {
                alert('[DEBUG] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            info: function() {
                alert('[INFO] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            warn: function() {
                alert('[WARN] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            error: function() {
                alert('[ERROR] ' +  Array.prototype.join.call(arguments, '\n'));
            }
        };

        Device.addLoggingStrategy( Module.id, loggingMethods );
    }
);
