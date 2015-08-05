/* global webapis */

/**
 * @fileOverview Requirejs module containing the antie.devices.broadcastsource.samsungtvsource class.
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

require.def('antie/devices/broadcastsource/samsungtvsource',
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
         * Contains a Samsung Maple implementation of the antie broadcast TV source.
         * @see http://www.samsungdforum.com/Guide/ref00014/PL_WINDOW_SOURCE.html
         * @class
         * @name antie.devices.broadcastsource.SamsungTVSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */
        var PL_WINDOW_SOURCE_TV = 0; // The TV source
        var PL_WINDOW_SOURCE_MEDIA = 43; // The media source

        var PL_TV_EVENT_NO_SIGNAL = 101;
        var PL_TV_EVENT_SOURCE_CHANGED = 114;
        var PL_TV_EVENT_TUNE_SUCCESS = 103;

        var WINDOW_PLUGIN_DOM_ELEMENT_ID = "pluginObjectWindow";
        var TV_PLUGIN_DOM_ELEMENT_ID = "pluginObjectTV";

        var SamsungSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.SamsungTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {
                this._samsungSefWindowPlugin = document.getElementById(WINDOW_PLUGIN_DOM_ELEMENT_ID);

                if (!this._samsungSefWindowPlugin) {
                    throw new Error('Unable to initialise Samsung broadcast source');
                }

                var tvPlugin = document.getElementById(TV_PLUGIN_DOM_ELEMENT_ID);

                var self = this;

		this.playState = BaseTvSource.STATE.UNKNOWN;
		
                tvPlugin.OnEvent = function(id) {
                    switch (parseInt(id)) {
                        case PL_TV_EVENT_NO_SIGNAL:
                            self.playState = BaseTvSource.STATE.UNAVAILABLE;
			    var unavailableEvent = new TunerUnavailableEvent();
                            RuntimeContext.getCurrentApplication().broadcastEvent(unavailableEvent);
                            break;
                        case PL_TV_EVENT_SOURCE_CHANGED:
                            self.playState = BaseTvSource.STATE.STOPPED;
                            var stoppedEvent = new TunerStoppedEvent();
                            RuntimeContext.getCurrentApplication().broadcastEvent(stoppedEvent);
                            break;
                        case PL_TV_EVENT_TUNE_SUCCESS:
			    self.playState = BaseTvSource.STATE.PRESENTING;
                            var presentingEvent = new TunerPresentingEvent(self.getCurrentChannelName());
                            RuntimeContext.getCurrentApplication().broadcastEvent(presentingEvent);
                            break;
                    }
                };

                tvPlugin.SetEvent(PL_TV_EVENT_TUNE_SUCCESS);
                tvPlugin.SetEvent(PL_TV_EVENT_NO_SIGNAL);
                tvPlugin.SetEvent(PL_TV_EVENT_SOURCE_CHANGED);

                this._setBroadcastToFullScreen();
            },
	    /**
              * Indicates the current state of the broadcast source
              * @returns {antie.devices.broadcastsources.BaseTvSource.STATE} current state of the broadcast source
              */             
            getState : function() {
                return this.playState;
            },
            /**
             * Sets the current source to TV broadcast
             * @see http://www.samsungdforum.com/Guide/ref00014/SetSource.html
             */
            showCurrentChannel: function () {
                this._samsungSefWindowPlugin.SetSource(PL_WINDOW_SOURCE_TV);
            },
            /**
             * Sets the current source to the media source
             * @see http://www.samsungdforum.com/Guide/ref00014/SetSource.html
             */
            stopCurrentChannel: function() {
                this._samsungSefWindowPlugin.SetSource(PL_WINDOW_SOURCE_MEDIA);
            },
            /**
             * Gets the service name of the current channel
             * @see http://www.samsungdforum.com/Guide/ref00014/getcurrentchannel_servicename.html
             */
            getCurrentChannelName: function () {
                var channelName = this._samsungSefWindowPlugin.GetCurrentChannel_Name();
                if (channelName < 0) {
                    throw new Error('Channel name returned error code: ' + channelName);
                }
                return channelName;
            },
            getChannelNameList: function (params) {

                var self = this;

                this._getChannelList( {
		    onSuccess : function(mapleChannels) {
                        var result = [];
                        for (var i = 0; i < mapleChannels.length; i++) {
                            result.push(mapleChannels[i].channelName);
                        }
                        params.onSuccess(result);
		    },
		    onError: params.onError
		});
            },
            _getChannelList: function (params) {
                var self = this;
                try {
                    var onFailedToRetrieveChannelList = function () {
                        params.onError({
                            name : "ChannelListError",
                            message : "Channel list is not available"
                        });
                    };

                    webapis.tv.channel.getChannelList(params.onSuccess, onFailedToRetrieveChannelList,
                                                        webapis.tv.channel.NAVIGATOR_MODE_ALL, 0, 1000000);

                } catch (error) {

                    params.onError({
                        name : "ChannelListError",
                        message : "Channel list is empty or not available"
                    });
                }
            },
            /**
             * Sets the size and position of the visible broadcast source
             * @param top
             * @param left
             * @param width
             * @param height
             */
            setPosition : function(top, left, width, height) {
                this._samsungSefWindowPlugin.SetScreenRect(left, top, width, height);
            },
            /**
             * Reverts the current screen settings and performs any clean up required before
             * the user exits the application back to standard broadcast.
             * @see http://www.samsungdforum.com/Guide/tec00103/index.html
             */
            destroy : function() {
                this.setPosition(0, -1, 0, 0);
            },

            setChannelByName : function(params) {
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
                } catch(error) {
                    params.onError({
                        name : "ChannelError",
                        message: "Unable to determine current channel name"
                    });
		}

            },
            _setBroadcastToFullScreen : function() {
                var currentLayout = RuntimeContext.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            },

            _tuneToChannelByName : function (params) {
                var self = this;
                var onChannelListRetrieved = function (channels) {
                    var channel;

		    for (var i = 0; i < channels.length; i++) {
                        if (channels[i].channelName == params.name) {
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
                            name : "ChannelError",
                            message : "Channel could not be found"
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
            _tuneToChannel: function(params) {

                var channel = params.channel;
                try {
                    var tuneError = function () {
                        params.onError({
                            name : "ChangeChannelError",
                            message : "Error tuning channel"
                        });
                    };

                    // Last argument is the Window ID.
                    // See http://www.samsungdforum.com/Guide/ref00008/tvchannel/dtv_tvchannel_module.html
                    webapis.tv.channel.tune(channel, params.onSuccess, tuneError, 0);

                } catch (e) {
                    params.onError({
                        name : "ChangeChannelError",
                        message : "Error tuning channel"
                    });
                }
            }

        });

        /**
         * Create a new widget giving control over broadcast television. Check whether
         * the broadcast television API is available first with isBroadcastSourceSupported().
         * @see antie.widgets.broadcastsource
         * @returns {Object} Device-specific implementation of antie.widgets.broadcastsource
         */
        Device.prototype.createBroadcastSource = function() {
            if (!this._broadcastSource) {
                this._broadcastSource = new SamsungSource();
            }

            return this._broadcastSource;
        };

        // Return for testing purposes only
        return SamsungSource;
    }
);
