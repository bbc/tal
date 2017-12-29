/* global jstestdriver */

/**
 * @fileOverview Requirejs module containing base antie.devices.logging.jstestdriver class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

//logs to the jstestdriver console
define(
    'antie/devices/logging/jstestdriver',
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
            log: function log () {
                jstestdriver.console.log.apply(jstestdriver.console, arguments);
            },
            debug: function debug () {
                jstestdriver.console.debug.apply(jstestdriver.console, arguments);
            },
            info: function info () {
                jstestdriver.console.info.apply(jstestdriver.console, arguments);
            },
            warn: function warn () {
                jstestdriver.console.warn.apply(jstestdriver.console, arguments);
            },
            error: function error () {
                jstestdriver.console.error.apply(jstestdriver.console, arguments);
            }
        };

        Device.addLoggingStrategy( Module.id, loggingMethods );
    }
);
