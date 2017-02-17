/**
 * @fileOverview Requirejs module containing base antie.devices.logging.consumelog class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

// equivalent of logging to >dev/null
define(
    'antie/devices/logging/consumelog',
    [
        'module',
        'antie/devices/device'
    ],
    function( Module, Device ) {
        'use strict';

        function ignore() {}

        var loggingMethods = {
            log: ignore,
            debug: ignore,
            info: ignore,
            warn: ignore,
            error: ignore
        };

        Device.addLoggingStrategy(Module.id, loggingMethods);
    }
);
