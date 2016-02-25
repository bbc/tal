/* global tizen */

/**
 * @fileOverview Requirejs module containing the antie.devices.broadcastsource.tizentvsource class.
 *
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
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
            init: function () {
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
            getState: function () {
                return this.playState;
            },

            /**
             * Sets current state and also checks state prerequisites
             * @param state antie.devices.broadcastsources.BaseTvSource.STATE
             */
            setState: function (state) {
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
            showCurrentChannel: function () {
                this._setBroadcastToFullScreen();
            },

            /**
             * Hides broadcast signal window
             * @override
             */
            stopCurrentChannel: function () {
                var self = this;
                tizen.tvwindow.hide(function () {
                    self.setState(BaseTvSource.STATE.STOPPED);
                });
            },

            /**
             * Gets the service name of the current channel
             * @override
             */
            getCurrentChannelName: function () {
                return tizen.tvchannel.getCurrentChannel().channelName;
            },

            /**
             * Gets only channel names from channel list
             * @override
             */
            getChannelNameList: function (params) {
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                this._getChannelList({
                    onSuccess: function (channels) {
                        var result = [];
                        for (var i = 0, len = channels.length; i < len; i++) {
                            result.push(channels[i].channelName);
                        }
                        params.onSuccess(result);
                    },
                    onError: params.onError
                });
            },

            _getChannelList: function (params) {
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
            setPosition: function (top, left, width, height) {
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
            destroy: function () {
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
            setChannelByName: function (params) {
                params.onSuccess = params.onSuccess || this.nop;
                params.onError = params.onError || this.nop;

                try {
                    var currentChannelName = this.getCurrentChannelName();
                    if (currentChannelName === params.channelName) {
                        this.showCurrentChannel();
                        params.onSuccess();
                    } else {
                        this._tuneToChannelByName({
                            name: params.channelName,
                            onError: params.onError,
                            onSuccess: params.onSuccess
                        });
                    }
                } catch (error) {
                    params.onError({
                        name: 'ChannelError',
                        message: 'Unable to determine current channel name'
                    });
                }
            },

            _setBroadcastToFullScreen: function () {
                this.setPosition(0, 0, window.screen.width, window.screen.height);
            },

            _tuneToChannelByName: function (params) {
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
            _tuneToChannel: function (params) {
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
                        onsuccess: function () {
                            self._setBroadcastToFullScreen();
                            self.setState(BaseTvSource.STATE.PRESENTING);
                            params.onSuccess();
                        },
                        onnosignal: function () {
                            self.setState(BaseTvSource.STATE.UNAVAILABLE);
                        },
                        onprograminforeceived: function () {}
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
