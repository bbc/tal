/**
 * @fileOverview Requirejs module containing base antie.devices.logging.alert class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
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
            log: function log () {
                alert('[LOG] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            debug: function debug () {
                alert('[DEBUG] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            info: function info () {
                alert('[INFO] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            warn: function warn () {
                alert('[WARN] ' +  Array.prototype.join.call(arguments, '\n'));
            },
            error: function error () {
                alert('[ERROR] ' +  Array.prototype.join.call(arguments, '\n'));
            }
        };

        Device.addLoggingStrategy( Module.id, loggingMethods );
    }
);
