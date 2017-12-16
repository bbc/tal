/**
 * @fileOverview Requirejs module containing base antie.devices.logging.xhr class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

//Logs to via an XML HTTP Request ( XHR )
define(
    'antie/devices/logging/xhr',
    [
        'module',
        'antie/runtimecontext',
        'antie/devices/device'
    ],
    function(Module, RuntimeContext, Device) {
        'use strict';

        function zeroFill(number, width) {
            width -= number.toString().length;
            if (width > 0){
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }
            return number + ''; // always return a string
        }

        function sendXHRLogMessage(tag, message){
            var now = new Date();
            var timeString = '' + zeroFill( now.getHours(), 2 ) + ':' + zeroFill( now.getMinutes(), 2 ) + ':' + zeroFill( now.getSeconds(), 2 );
            var messageObj = { command : 'add', message : '[' + timeString + '][' + tag + ']' +  message };
            xhrPost( '/tvpjsframeworklogging', {}, messageObj );
        }

        var loggingMethods = {
            /**
             * Sets the iterator pointer to the first item
             */
            log: function log () {
                sendXHRLogMessage('LOG', Array.prototype.join.call(arguments, '\n'));
            },
            debug: function debug () {
                sendXHRLogMessage( 'DEBUG', Array.prototype.join.call(arguments, '\n'));
            },
            info: function info () {
                sendXHRLogMessage('INFO', Array.prototype.join.call(arguments, '\n'));
            },
            warn: function warn () {
                sendXHRLogMessage('WARN', Array.prototype.join.call(arguments, '\n'));
            },
            error: function error () {
                sendXHRLogMessage('ERROR', Array.prototype.join.call(arguments, '\n'));
            }
        };

        Device.addLoggingStrategy(Module.id, loggingMethods);

        function xhrPost(url, opts, messageObject) {

            var http = new XMLHttpRequest();
            var jsonMessage = JSON.stringify(messageObject);

            http.open('POST', url, true);

            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            http.onreadystatechange = function() {//Call a function when the state changes.
                if (this.readyState === 4) {
                    this.onreadystatechange = null;
                    if (this.status === 200) {
                        if (opts.onLoad) {
                            opts.onOkay(this.responseText);
                        }
                    } else {
                        if (opts.onError) {
                            opts.onError(this.responseText, this.status);
                        }
                    }
                }
            };
            http.send( jsonMessage );
        }
    }
);
