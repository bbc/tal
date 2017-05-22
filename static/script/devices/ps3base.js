/**
 * @fileOverview Requirejs module containing the antie.devices.PS3Base class for all PS3 browsers.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/ps3base',
    [
        'antie/devices/browserdevice',
        'antie/events/networkstatuschangeevent'
    ],
    function(BrowserDevice, NetworkStatusChangeEvent) {
        'use strict';

        var enableDebugging = false;

        var debug = null;
        var endtag = /(<\/[a-zA-Z]+>)\s/g;

        if(enableDebugging) {
            if(window.external && window.external.webbrowser) {
                window.external.webbrowser.startDebugging();
            }
        }
        if(!window.console) {
            window.console = {
                log: function() {}
            };
        }

        return BrowserDevice.extend({
            init: function(config) {
                this._super(config);
                this._nativeCallbacks = [];

                this.addNativeEventListener('networkStatusChange', function(networkStatus) {
                    // Fire an event into the application when the network is connected/disconnected
                    var status = (networkStatus.newState === 'connected') ?
                          NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE :
                          NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE;

                    self._application.bubbleEvent(new NetworkStatusChangeEvent(status));
                });

                var self = this;
                this.nativeCommand('getDeviceInfo', null, function(deviceInfo) {
                    self.outputPortType = deviceInfo.portType;
                    self.nativeCommand('dismissSplash');
                });
                this._endtag = endtag;
            },
            nativeCallback: function(json) {
                var data = this.decodeJson(json);

                if(enableDebugging) {
                    if(!debug) {
                        debug = document.createElement('div');
                        debug.id = 'debug';
                        debug.style.position = 'absolute';
                        debug.style.top = '10px';
                        debug.style.left = '10px';
                        debug.style.color = 'white';
                        debug.style.margin = '10px';
                        debug.style.zIndex = '9999';
                        debug.innerHTML = 'debug output here...';
                        document.body.appendChild(debug);
                    }
                    if(data.command !== 'getContentParameters') {
                        debug.innerText = '---> ' + json.replace(/&/g,'&amp;');
                    }
                }

                var callbacks = this._nativeCallbacks[data.command];
                if(callbacks && callbacks.length > 0) {
                    switch(data.command) {
                    case 'getContentParameters':
                    case 'contentAvailable':
                    case 'applicationStatusChange':
                    case 'networkStatusChange':
                    case 'playerStatusChange':
                    case 'playerSubtitle':
                    case 'playerStreamingError':
                    case 'playerError':
                    case 'playerMessage':
                    case 'externalParameter':
                    case 'shutdownNotification':
                    case 'fbAccessToken':
                    case 'psnActivityFeedResponse':
                    case 'onOskClose':
                    case 'touchPanelEvent':
                    case 'psnCommerceProductDataResponse':
                    case 'psnCommerceCategoryDataResponse':
                    case 'psnEntitlementList':
                    case 'psnCommercePurchaseProductResponse':
                    case 'psnCommerceCheckoutResponse':
                    case 'lowBatteryNotification':
                    case 'npAuthCodeResponse':
                    case 'resetVrPosition':
                        // multiple event listeners may be listening for these events
                        for(var i = 0; i < callbacks.length; i++) {
                            callbacks[i](data);
                        }
                        break;
                    default:
                        // function return (pick the earliest callback handler)
                        var callback = callbacks.shift(1);
                        callback(data);
                        break;
                    }
                }
            },
            addNativeEventListener: function(name, callback) {
                var callbacks;
                if(!(callbacks = this._nativeCallbacks[name])) {
                    callbacks = this._nativeCallbacks[name] = [];
                } else {
                    this.removeNativeEventListener(name, callback);
                }
                callbacks.push(callback);
            },
            removeNativeEventListener: function(name, callback) {
                var callbacks = this._nativeCallbacks[name];
                if(callbacks) {
                    for(var i=0; i<callbacks.length; i++) {
                        if(callbacks[i] === callback) {
                            callbacks.splice(i, 1);
                            return;
                        }
                    }
                }
            },
            nativeCommand: function(command, args, callback) {
                var callbacks;
                if(!(callbacks = this._nativeCallbacks[command])) {
                    callbacks = this._nativeCallbacks[command] = [];
                }
                if(callback) {
                    callbacks.push(callback);
                }

                var obj = {command: command};
                if(args) {
                    for(var prop in args) {
                        if(args.hasOwnProperty(prop)) {
                            obj[prop] = args[prop];
                        }
                    }
                }

                var json = this.encodeJson(obj);

                if(enableDebugging) {
                    if(!debug) {
                        debug = document.createElement('div');
                        debug.id = 'debug';
                        debug.style.position = 'absolute';
                        debug.style.top = '10px';
                        debug.style.left = '10px';
                        debug.style.color = 'white';
                        debug.style.margin = '10px';
                        debug.style.zIndex = '9999';
                        debug.innerHTML = 'debug output here...';
                        document.body.appendChild(debug);
                    }
                    debug.innerText = '<--- ' + json;
                }

                if(window.external && window.external.user) {
                    window.external.user(json);
                }
            },
            /**
             * Loads a resource from a URL protected by device authentication
             */
            loadAuthenticatedURL: function(url, opts) {
                var collectedContentDocument = '';
                var collectedBytes = 0;
                var messageSize = 0;

                var self = this;

                function handleResponseChunk(response) {
                    messageSize = parseInt(response.messageSize, 10);
                    collectedContentDocument += response.contentDocument;
                    collectedBytes += parseInt(response.chunkSize, 10);

                    if(collectedBytes < messageSize) {
                        return;
                    }

                    // Timeout already occurred - bail
                    if(!timeoutHandle) {
                        return;
                    }
                    window.clearTimeout(timeoutHandle);

                    self.removeNativeEventListener('getContentParameters', handleResponseChunk);

                    function decodeHTML(str) {
                        var e = document.createElement('div');
                        e.innerHTML = str;
                        return e.innerText;
                    }

                    if(response.status === 'ok') {
                        opts.onLoad(decodeHTML(collectedContentDocument));
                    } else {
                        opts.onError(decodeHTML(collectedContentDocument));
                    }
                }

                var timeoutHandle = window.setTimeout(function() {
                    timeoutHandle = 0;
                    opts.onError('timeout');

                    self.removeNativeEventListener('getContentParameters', handleResponseChunk);
                }, opts.timeout || 10000);

                this.addNativeEventListener('getContentParameters', handleResponseChunk);
                this.nativeCommand('getContentParameters', {parameterUrl: url});
            },
            /**
             * Checks to see if HD output is currently enabled.
             * @returns True if HD is currently enabled.
             */
            isHDEnabled: function() {
                // HD should only be enabled when HDMI is used
                return (this.outputPortType === 'HDMI');
            }
        });
    }
);
