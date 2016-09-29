/**
 * @fileOverview Requirejs module containing base antie.devices.logging.onscreen class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

//logs to the screen
define(
    'antie/devices/logging/onscreen',
    [
        'module',
        'antie/devices/device'
    ],
    function( Module, Device) {
        'use strict';

        var div = null;
        var logItems = [];

        function prependItem(text) {
            if(!div) {
                div = document.createElement('div');
                div.id = '__onScreenLogging';
                div.style.zIndex = 9999999;
                div.style.position = 'absolute';
                div.style.top = '0';
                div.style.left = '0';
                div.style.padding = '20px';
                // set a non-rgba colour first in case they're not supported
                div.style.backgroundColor = '#d8d8d8';
                div.style.backgroundColor = 'rgba(216,216,216,0.8)';
                div.style.color = '#000000';
                div.style.lineHeight = '12px';
                div.style.fontSize = '12px';
                document.body.appendChild(div);
            }
            logItems.push(text);
            if(logItems.length > 10) {
                logItems.shift();
            }
            div.innerHTML = logItems.join('<hr />');
        }
        var loggingMethods = {
            /**
             * Sets the iterator pointer to the first item
             */
            log: function() {
                prependItem.call(this, '[LOG] ' + Array.prototype.join.call(arguments, '<br/>'));
            },
            debug: function() {
                prependItem.call(this, '[DEBUG] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            info: function() {
                prependItem.call(this, '[INFO] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            warn: function() {
                prependItem.call(this, '[WARN] ' +  Array.prototype.join.call(arguments, '<br/>'));
            },
            error: function() {
                prependItem.call(this, '[ERROR] ' +  Array.prototype.join.call(arguments, '<br/>'));
            }
        };

        Device.addLoggingStrategy(Module.id, loggingMethods);
    }
);
