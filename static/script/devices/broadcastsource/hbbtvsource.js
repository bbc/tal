/**
 * @fileOverview Requirejs module containing the antie.widgets.hbbtvsource class.
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

require.def('antie/devices/broadcastsource/hbbtvsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/runtimecontext',
        'antie/devices/broadcastsource/channel',
        'antie/events/tunerunavailableevent',
        'antie/events/tunerpresentingevent',
        'antie/events/tunerstoppedevent'
    ],
    function (Device, BaseTvSource, RuntimeContext, Channel, TunerUnavailableEvent, TunerPresentingEvent, TunerStoppedEvent ) {
        'use strict';

        /**
         * Contains a HBBTV implementation of the antie broadcast TV source.
         * @class
         * @name antie.devices.broadcastsource.HbbTVSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */
        var DOM_ELEMENT_ID = 'broadcastVideoObject';
        var ID_DVB_T = 12;
        var HbbTVSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.HbbTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {

                var self = this;
                this._broadcastVideoObject = document.getElementById(DOM_ELEMENT_ID);

                if (!this._broadcastVideoObject) {
                    throw new Error('Unable to initialise HbbTV broadcast source');
                }

                // adding as instance rather then class var as module instantiated via method
                this._playStates = {
                    UNREALIZED: 0,
                    CONNECTING: 1,
                    PRESENTING: 2,
                    STOPPED: 3
                };

                this.playState = this._playStates.UNREALIZED;

                this._broadcastVideoObject.addEventListener("PlayStateChange", function() {

                    var oldPlayState = self.playState;
                    // Note! The play state may change during the execution of this method; capture it so we
                    // have a consistent value for the duration of the event listener.
                    // See OIPF DAE specification section 7.14.9
                    var newPlayState = self.getPlayState();

                    if (oldPlayState === self._playStates.PRESENTING && newPlayState === self._playStates.UNREALIZED) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerUnavailableEvent());

                    } else if (newPlayState === self._playStates.PRESENTING) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerPresentingEvent(self.getCurrentChannel()));

                    } else if (newPlayState === self._playStates.STOPPED) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerStoppedEvent());
                    }

                    self.playState = newPlayState;

                });
            },
            showCurrentChannel: function () {
                // Check if exception is thrown by bindToCurrentChannel?
                this._setBroadcastToFullScreen();
                this._broadcastVideoObject.bindToCurrentChannel();
                this._broadcastVideoObject.style.visibility = "visible";
            },
            stopCurrentChannel: function () {
                try {
                    if (this.getPlayState() === this._playStates.UNREALIZED) {
                        this._broadcastVideoObject.bindToCurrentChannel();
                    }
                } catch(e) {
                    throw new Error("Unable to bind to current channel");
                }

                this._broadcastVideoObject.stop();
                this._broadcastVideoObject.style.visibility = "hidden";
                this.setPosition(0, 0, 0, 0);
            },
            getCurrentChannelName: function () {
                var channelConfig = this._broadcastVideoObject.currentChannel;
                // maybe check the hbbtv docs to check return type
                if (channelConfig === null) {
                    throw new Error('Current channel name not available');
                }

                if (channelConfig.name === null) {
                    throw new Error('Current channel name is null');
                }

                if (typeof channelConfig.name === "undefined") {
                    throw new Error('Current channel name is not defined');
                }

                return channelConfig.name;
            },
            getChannelList : function (params) {
                try {
                    var result = this._getChannelList();
                    params.onSuccess(result);

                } catch (e) {
                    params.onError(e);
                }
            },
            getCurrentChannel : function () {
                var result = false;

                var currentChannel = this._broadcastVideoObject.currentChannel;

                if (currentChannel) {
                    result = new Channel({
                        name : currentChannel.name,
                        idType: currentChannel.idType,
                        onid: currentChannel.onid,
                        tsid: currentChannel.tsid,
                        sid: currentChannel.sid
                    });
                }

                return result;
            },
            setChannelByName : function(params) {

                var currentChannel = this.getCurrentChannel();

                if (!currentChannel) {
                    params.onError({
                        name : "ChannelError",
                        message: "Unable to determine current channel name"
                    });

                } else if (params.channelName === currentChannel.name) {
                    this.showCurrentChannel();
                    params.onSuccess();

                } else {
                    try {
                        var channelList = this._getChannelList();
                        var channel;

                        for (var i = 0; i < channelList.length; i++) {
                            if (channelList[i].name === params.channelName) {
                                channel = channelList[i];
                                break;
                            }
                        }

                        if (!channel) {
                            throw {
                                name : "ChannelError",
                                message: params.channelName + " not found in channel list"
                            };
                        }

                        this._tuneToChannelObject(channel, params.onSuccess, params.onError);

                    } catch(e) {
                        params.onError(e);
                    }
                }
            },
            setPosition : function(top, left, width, height) {
                this._broadcastVideoObject.style.top = top + "px";
                this._broadcastVideoObject.style.left = left + "px";
                this._broadcastVideoObject.style.width = width + "px";
                this._broadcastVideoObject.style.height = height + "px";
            },
            getPlayState : function() {
                return this._broadcastVideoObject.playState;
            },
            destroy : function() {
                // Not currently required for hbbtv
            },
            setChannel : function(params) {
                var idType = this._getChannelIdType();
                this._tuneToChannelByTriplet(idType, params.onid, params.tsid, params.sid, params.onSuccess, params.onError);
            },
            _tuneToChannelByTriplet: function (idType, onid, tsid, sid, onSuccess, onError) {
                var newChannel = this._broadcastVideoObject.createChannelObject(idType, onid, tsid, sid);
                if (newChannel === null) {
                    onError({
                        name : "ChannelError",
                        message : "Channel could not be found"
                    });
                } else {
                    this._tuneToChannelObject(newChannel, onSuccess, onError);
                }
            },
            _tuneToChannelObject: function (newChannel, onSuccess, onError) {
                var self = this;
                var successEventListener = function(/* channel */) {
                    self._broadcastVideoObject.removeEventListener("ChannelChangeSucceeded", successEventListener);
                    self._broadcastVideoObject.removeEventListener("ChannelChangeError", errorEventListener);
                    onSuccess();
                };

                var errorEventListener = function(/* channel, errorState */) {
                    self._broadcastVideoObject.removeEventListener("ChannelChangeSucceeded", successEventListener);
                    self._broadcastVideoObject.removeEventListener("ChannelChangeError", errorEventListener);
                    onError({
                        name : "ChangeChannelError",
                        message : "Error tuning channel"
                    });
                };

                this._broadcastVideoObject.addEventListener("ChannelChangeSucceeded", successEventListener);
                this._broadcastVideoObject.addEventListener("ChannelChangeError", errorEventListener);

                this._broadcastVideoObject.setChannel(newChannel);
            },
            /**
             * @returns The type of the channel, as indicated by one of the ID_* constants in the HBBTV
             *      specification. Defaults to ID_DVB_T in the case of error
             *  @private
             */
            _getChannelIdType : function() {
                var idType;
                try {
                    idType = this._broadcastVideoObject.currentChannel.idType;
                    if (typeof idType === "undefined") {
                        idType = ID_DVB_T;
                    }
                } catch(e) {
                    idType = ID_DVB_T;
                }

                return idType;
            },
            /**
             * Sets the size of the broadcast object to be the same as the required screen size identified by antie at
             * application start up.
             */
            _setBroadcastToFullScreen : function() {
                var currentLayout = RuntimeContext.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            },
            _getChannelList : function() {
                function getChannelFromChannelList (channelList, index) {
                    if (typeof channelList.item === "function") {
                        return channelList.item(index);
                    } else {
                        return channelList[index];
                    }
                }

                var channelConfig;

                try {
                    channelConfig = this._broadcastVideoObject.getChannelConfig();
                } catch (e) {
                    throw {
                        name : "ChannelListError",
                        message : "Channel list is not available"
                    };
                }

                if (!channelConfig || !channelConfig.channelList || channelConfig.channelList.length === 0) {
                    throw {
                        name : "ChannelListError",
                        message : "Channel list is empty or not available"
                    };
                }

                var result = [];
                for (var i = 0; i < channelConfig.channelList.length; i++) {
                    var channel = getChannelFromChannelList(channelConfig.channelList, i);
                    result.push(new Channel(
                        {
                            name: channel.name,
                            idType: channel.idType,
                            onid: channel.onid,
                            sid: channel.sid,
                            tsid: channel.tsid
                        }
                    ));
                }
                return result;
            }
        });

        Device.prototype.isBroadcastSourceSupported = function() {
            return this.getHistorian().hasBroadcastOrigin();
        };

        /**
         * Create a broadcastSource object on the Device to be
         * accessed as a singleton to avoid the init being run
         * multiple times
         */
        Device.prototype.createBroadcastSource = function() {
            if (!this._broadcastSource) {
                this._broadcastSource = new HbbTVSource();
            }

            return this._broadcastSource;
        };

        // Return the HbbtvSource object for testing purposes
        return HbbTVSource;
    }
);
