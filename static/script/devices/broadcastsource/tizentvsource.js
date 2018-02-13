/* global tizen */

/**
 * @fileOverview Requirejs module containing base antie.devices.broadcastsource.tizentvsource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/broadcastsource/tizentvsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/runtimecontext',
        'antie/events/tunerunavailableevent',
        'antie/events/tunerstoppedevent',
        'antie/events/tunerpresentingevent'
    ],
    function (Device, BaseTvSource, RuntimeContext, TunerUnavailableEvent, TunerStoppedEvent, TunerPresentingEvent) {
        'use strict';

        /**
         * Contains a Samsung Tizen implementation of the antie broadcast TV source.
         * @see http://www.samsungdforum.com/tizenapiguide/?FolderName=tizen881&FileName=index.html
         * @class
         * @name antie.devices.broadcastsource.TizenTVSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */
        var TUNE_MODE_ALL = 'ALL'; // Tuning mode for getChannelList
        var TV_WINDOW_MAIN = 'MAIN';
        var TV_WINDOW_ORDER_BEHIND = 'BEHIND';
        var SIGNAL_STATE_OK = 'SIGNAL_STATE_OK';
        var SIGNAL_STATE_NO_SIGNAL = 'SIGNAL_STATE_NO_SIGNAL';

        var TizenSource = BaseTvSource.extend( /** @lends antie.devices.broadcastsource.TizenTVSource.prototype */ {
            /**
             * @constructor
             * @override
             * @ignore
             */
            init: function init () {
                if (typeof tizen === 'undefined' || typeof tizen.tvchannel === 'undefined' ||
                    typeof tizen.tvwindow === 'undefined') {
                    throw new Error('Unable to initialize Tizen broadcast object, not found');
                }

                var self = this;

                this.signalStateChangeListenerId = -1;
                this.nop = function () {};

                this.signalStateChangeListenerId = tizen.tvchannel.addSignalStateChangeListener(function (signalState) {
                    switch (signalState) {
                    case SIGNAL_STATE_OK:
                        self.setState(BaseTvSource.STATE.PRESENTING);
                        break;
                    case SIGNAL_STATE_NO_SIGNAL:
                        self.setState(BaseTvSource.STATE.UNAVAILABLE);
                        break;
                    }
                });
                
                this.playState = BaseTvSource.STATE.UNKNOWN;
            },

            /**
             * Indicates the current state of the broadcast source
             * @override
             * @returns {antie.devices.broadcastsources.BaseTvSource.STATE} current state of the broadcast source
             */
            getState: function getState () {
                return this.playState;
            },

            /**
             * Sets current state and also checks state prerequisites
             * @param state antie.devices.broadcastsources.BaseTvSource.STATE
             */
            setState: function setState (state) {
                // If already set, skip, with exception to presenting, which
                // will always be emitted
                if (state === this.getState() && state !== BaseTvSource.STATE.PRESENTING) {
                    return;
                }
                
                switch (state) {
                case BaseTvSource.STATE.UNAVAILABLE:
                    this.playState = state;
                    RuntimeContext.getCurrentApplication().broadcastEvent(
                        new TunerUnavailableEvent());
                    break;
                case BaseTvSource.STATE.PRESENTING:
                    this.playState = state;
                    RuntimeContext.getCurrentApplication().broadcastEvent(
                        new TunerPresentingEvent(this.getCurrentChannelName()));
                    break;
                case BaseTvSource.STATE.STOPPED:
                    this.playState = state;
                    RuntimeContext.getCurrentApplication().broadcastEvent(
                        new TunerStoppedEvent());
                    break;
                }
            },

            /**
             * Shows current channel by setting broadcast source to full screen
             * @override
             */
            showCurrentChannel: function showCurrentChannel () {
                this._setBroadcastToFullScreen();
            },

            /**
             * Hides broadcast signal window
             * @override
             */
            stopCurrentChannel: function stopCurrentChannel () {
                var self = this;
                tizen.tvwindow.hide(function () {
                    self.setState(BaseTvSource.STATE.STOPPED);
                });
            },

            /**
             * Gets the service name of the current channel
             * @override
             */
            getCurrentChannelName: function getCurrentChannelName () {
                return tizen.tvchannel.getCurrentChannel().channelName;
            },

            /**
             * Gets only channel names from channel list
             * @override
             */
            getChannelNameList: function getChannelNameList (params) {
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                this._getChannelList({
                    onSuccess: function onSuccess (channels) {
                        var result = [];
                        for (var i = 0, len = channels.length; i < len; i++) {
                            result.push(channels[i].channelName);
                        }
                        params.onSuccess(result);
                    },
                    onError: params.onError
                });
            },

            _getChannelList: function _getChannelList (params) {
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                var onFailedToRetrieveChannelList = function () {
                    params.onError({
                        name: 'ChannelListError',
                        message: 'Channel list is not available'
                    });
                };

                try {
                    tizen.tvchannel.getChannelList(params.onSuccess,
                                                   onFailedToRetrieveChannelList, TUNE_MODE_ALL);
                } catch (error) {
                    params.onError({
                        name: 'ChannelListError',
                        message: 'Channel list is empty or not available'
                    });
                }
            },

            /**
             * Sets the size and position of the visible broadcast source window
             * @param top
             * @param left
             * @param width
             * @param height
             */
            setPosition: function setPosition (top, left, width, height) {
                var self = this;

                tizen.tvwindow.show(
                    function () {
                        self.setState(BaseTvSource.STATE.PRESENTING);
                    },
                    this.nop,
                    [left, top, width, height],
                    TV_WINDOW_MAIN,
                    TV_WINDOW_ORDER_BEHIND
                );
            },

            /**
             * @override
             */
            destroy: function destroy () {
                if (this.signalStateChangeListenerId !== -1) {
                    tizen.tvchannel.removeSignalStateChangeListener(this.signalStateChangeListenerId);
                }
                tizen.tvwindow.hide(this.nop);
            },

            /**
             * Tries to set channel basing only on params.channelName
             * @overrides
             * @param params.channelName
             */
            setChannelByName: function setChannelByName (params) {
                var self = this;
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                try {
                    var currentChannelName = this.getCurrentChannelName(),
                        app = RuntimeContext.getCurrentApplication(),
                        changeChannelHandler = function() {                         
                            app.removeEventListener('tunerpresenting', changeChannelHandler);
                            self._tuneToChannelByName({
                                name: params.channelName,
                                onError: params.onError,
                                onSuccess: params.onSuccess
                            });                        
                        },
                        sameChannelHandler = function() {            
                            app.removeEventListener('tunerpresenting', sameChannelHandler);  
                            params.onSuccess();
                        };

                    app.addEventListener(
                        'tunerpresenting', 
                        (currentChannelName === params.channelName ? sameChannelHandler : changeChannelHandler));
                        
                    this.showCurrentChannel();
 
                } catch (error) {
                    params.onError({
                        name: 'ChannelError',
                        message: 'Unable to determine current channel name'
                    });
                }
            },

            _setBroadcastToFullScreen: function _setBroadcastToFullScreen () {
                this.setPosition(0, 0, window.screen.width, window.screen.height);
            },

            _tuneToChannelByName: function _tuneToChannelByName (params) {
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                var self = this;

                var onChannelListRetrieved = function (channels) {
                    var channel;

                    for (var i = 0, len = channels.length; i < len; i++) {
                        if (channels[i].channelName === params.name) {
                            channel = channels[i];
                            break;
                        }
                    }

                    if (channel) {
                        self._tuneToChannel({
                            channel: channel,
                            onError: params.onError,
                            onSuccess: params.onSuccess
                        });
                    } else {
                        params.onError({
                            name: 'ChannelError',
                            message: 'Channel could not be found'
                        });
                    }
                };

                this._getChannelList({
                    onError: params.onError,
                    onSuccess: onChannelListRetrieved
                });
            },

            /**
             * @param params.channel Channel object
             * @param params.onError Function to call with a string message on error.
             * @param params.onSuccess Function to call on success.
             * @private
             */
            _tuneToChannel: function _tuneToChannel (params) {
                params.onError = params.onError || this.nop;
                params.onSuccess = params.onSuccess || this.nop;

                var channel = params.channel;
                var self = this;

                var tuneError = function () {
                    params.onError({
                        name: 'ChangeChannelError',
                        message: 'Error tuning channel'
                    });
                };

                try {
                    tizen.tvchannel.tune(channel, {
                        onsuccess: function onsuccess () {
                            self._setBroadcastToFullScreen();
                            self.setState(BaseTvSource.STATE.PRESENTING);
                            params.onSuccess();
                        },
                        onnosignal: function onnosignal () {
                            self.setState(BaseTvSource.STATE.UNAVAILABLE);
                        },
                        onprograminforeceived: function onprograminforeceived () {}
                    }, tuneError);
                } catch (error) {
                    params.onError({
                        name: 'ChangeChannelError',
                        message: 'Error tuning channel ' + error.message
                    });
                }
            }

        });

        Device.prototype.isBroadcastSourceSupported = function() {
            return true;
        };

        /**
         * Create a new widget giving control over broadcast television. Check
         * whether the broadcast television API is available first with
         * isBroadcastSourceSupported().
         * @see antie.widgets.broadcastsource
         * @returns {Object} Device-specific implementation of antie.widgets.broadcastsource
         */
        Device.prototype.createBroadcastSource = function () {
            if (!this._broadcastSource) {
                this._broadcastSource = new TizenSource();
            }

            return this._broadcastSource;
        };

        // Return for testing purposes only
        return TizenSource;
    }
);
