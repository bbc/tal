/**
 * @fileOverview Requirejs module containing base antie.devices.logging.saving class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

// Saves the logs for access later
define(
    'antie/devices/logging/saving',
    [
        'module',
        'antie/devices/device'
    ],
    function(Module, Device) {
        'use strict';

        var logItems = [];

        var saveData = function (type, data) {
            var cleanedData = [];
            for (var i = 0; i < data.length; ++i) {
                cleanedData.push(data[i] + '');
            }

            logItems.push({ 'level': type, 'message': cleanedData });
        };

        var loggingMethods = {
            log: function log () {
                saveData('LOG', arguments);
            },
            debug: function debug () {
                saveData('DEBUG', arguments);
            },
            info: function info () {
                saveData('INFO', arguments);
            },
            warn: function warn () {
                saveData('WARN', arguments);
            },
            error: function error () {
                saveData('ERROR', arguments);
            }
        };

        Device.addLoggingStrategy(Module.id, loggingMethods);
        return { getLogItems: function getLogItems () {
            var data = logItems.slice(0);
            logItems = [];
            return data;
        }};
    }
);
